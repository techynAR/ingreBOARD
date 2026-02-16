import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseIngredients } from './lib/ingredientParser.js';
import { detectAdditive } from './lib/additiveDetector.js';
import { calculateRiskScore } from './lib/riskEngine.js';
import { AnalysisResponse, AdditiveInfo } from './types.js';
import { normalizeOCRText } from './lib/normalizeText.js';
import { analyzeIngredientsWithAI, deepDiveAdditives } from './lib/aiAnalysis.js';

const allowCors = (fn: any) => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { barcode } = req.body as { barcode: string };

        if (!barcode || typeof barcode !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid "barcode" in request body.' });
        }

        console.log(`[Barcode] Scanning: ${barcode}`);

        // 1. Fetch from OpenFoodFacts
        const offUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,ingredients_text,ingredients_text_en,image_url,brands,categories_tags,nutriscore_grade,nova_group,ecoscore_grade`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const offRes = await fetch(offUrl, {
            headers: { 'User-Agent': 'IngreBOARD/2.0 (Research Prototype)' },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!offRes.ok) {
            return res.status(404).json({ error: 'Product not found on OpenFoodFacts.' });
        }

        const offData = await offRes.json();
        if (!offData.product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        const product = offData.product;
        const rawText = product.ingredients_text_en || product.ingredients_text;

        if (!rawText) {
            return res.status(200).json({
                metadata: {
                    systemVersion: 'IngreBOARD Research Prototype v2.0',
                    version: '2.0.0',
                    timestamp: new Date().toISOString(),
                    scoringModelVersion: 'v3-ai-risk-model',
                    dataSources: ['OpenFoodFacts'],
                    methodology: 'Barcode Lookup -> No Ingredients Found',
                    confidenceScore: 0,
                    productInfo: {
                        name: product.product_name || 'Unknown Product',
                        brand: product.brands,
                        imageUrl: product.image_url
                    }
                },
                ingredients: [],
                ingredientDetails: [],
                additives: [],
                additiveDeepDive: [],
                regulatoryFindings: [],
                scoring: { totalScore: 0, riskLevel: 'Unknown', breakdown: ['No ingredients listed.'] },
                healthSummary: null,
                limitations: ['Ingredients text missing in OpenFoodFacts database.']
            } as AnalysisResponse);
        }

        // 2. Normalize Text
        const { correctedText, usedAI } = await normalizeOCRText(rawText);

        // 3. Parse
        let ingredients = parseIngredients(correctedText);
        if (ingredients.length === 0) {
            const fallbackIngredients = parseIngredients(rawText);
            if (fallbackIngredients.length > 0) ingredients = fallbackIngredients;
        }

        if (ingredients.length === 0) {
            return res.status(200).json({
                metadata: {
                    systemVersion: 'IngreBOARD Research Prototype v2.0',
                    version: '2.0.0',
                    timestamp: new Date().toISOString(),
                    scoringModelVersion: 'v3-ai-risk-model',
                    dataSources: ['OpenFoodFacts'],
                    methodology: 'Barcode Lookup -> Text Parsing -> Empty',
                    confidenceScore: 0
                },
                ingredients: [],
                ingredientDetails: [],
                additives: [],
                additiveDeepDive: [],
                regulatoryFindings: [],
                scoring: { totalScore: 0, riskLevel: 'Unknown', breakdown: ['No ingredients detected.'] },
                healthSummary: null,
                limitations: ['Could not parse ingredients.']
            } as AnalysisResponse);
        }

        // 4. Detect & Score
        const initialFindings: (AdditiveInfo | null)[] = ingredients.map(ing => detectAdditive(ing));
        const { scoring, enrichedAdditives, dataSourceAdded } = await calculateRiskScore(ingredients, initialFindings);
        const validAdditives = (enrichedAdditives as AdditiveInfo[]).filter(a => a !== null);

        // 5. AI Analysis (parallel)
        const [aiAnalysis, additiveResearch] = await Promise.all([
            analyzeIngredientsWithAI(ingredients, initialFindings),
            deepDiveAdditives(validAdditives)
        ]);

        // 6. Data Sources
        const dataSources = ['OpenFoodFacts', 'RegulationDB (Local)'];
        if (usedAI) dataSources.push('Groq AI (Llama 3.3)');
        if (dataSourceAdded) dataSources.push('OpenFoodFacts (Enrichment)');
        if (aiAnalysis.ingredientDetails.some(d => d.source === 'AI Analysis')) {
            dataSources.push('AI Ingredient Analysis');
        }

        const findings: AdditiveInfo[] = (enrichedAdditives as AdditiveInfo[])
            .filter((a): a is AdditiveInfo => a !== null)
            .filter((a, index, self) => index === self.findIndex(t => t.code === a.code));

        let confidenceScore = 1.0;
        if (usedAI) confidenceScore = 0.95;
        if (aiAnalysis.healthSummary) confidenceScore = Math.min(confidenceScore + 0.03, 1.0);

        const response: AnalysisResponse = {
            metadata: {
                systemVersion: 'IngreBOARD Research Prototype v2.0',
                version: '2.0.0',
                timestamp: new Date().toISOString(),
                scoringModelVersion: 'v3-ai-risk-model',
                dataSources,
                methodology: 'Barcode → AI Clean → Parse → Detect → AI Analyze → Deep Dive → Score',
                confidenceScore,
                rawText,
                cleanedText: correctedText,
                processingFlags: { ocrEngine: 'OFF', usedAI, usedOFF: true },
                productInfo: {
                    name: product.product_name || 'Unknown Product',
                    brand: product.brands,
                    categories: product.categories_tags,
                    imageUrl: product.image_url,
                    nutriscore: product.nutriscore_grade,
                    novascore: product.nova_group,
                    ecoscore: product.ecoscore_grade
                }
            },
            ingredients,
            ingredientDetails: aiAnalysis.ingredientDetails,
            additives: findings.map(f => f.code),
            additiveDeepDive: additiveResearch,
            regulatoryFindings: findings,
            scoring,
            healthSummary: aiAnalysis.healthSummary,
            limitations: [
                'AI-Powered Analysis: Results are AI-generated and should be verified.',
                'Data from OpenFoodFacts: Accuracy depends on database content.',
                'Not Medical Advice: For educational use only.'
            ]
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Barcode Scan Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default allowCors(handler);
