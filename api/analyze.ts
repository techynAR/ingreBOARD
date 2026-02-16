import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseIngredients } from './lib/ingredientParser.js';
import { detectAdditive } from './lib/additiveDetector.js';
import { calculateRiskScore } from './lib/riskEngine.js';
import { AnalysisResponse, AnalyzeRequest, AdditiveInfo } from './types.js';
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
        const { rawText } = req.body as AnalyzeRequest;

        if (!rawText || typeof rawText !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid "rawText" in request body.' });
        }

        // 0. Normalize Text (AI Layer)
        const { correctedText, usedAI } = await normalizeOCRText(rawText);

        // 1. Parse
        let ingredients = parseIngredients(correctedText);

        if (ingredients.length === 0) {
            const fallbackIngredients = parseIngredients(rawText);
            if (fallbackIngredients.length > 0) {
                ingredients = fallbackIngredients;
            }
        }

        if (ingredients.length === 0) {
            return res.status(200).json({
                metadata: {
                    systemVersion: 'IngreBOARD Research Prototype v2.0',
                    version: '2.0.0',
                    timestamp: new Date().toISOString(),
                    scoringModelVersion: 'v3-ai-risk-model',
                    dataSources: ['None'],
                    methodology: 'Input Validation -> Empty Detection',
                    confidenceScore: 0
                },
                ingredients: [],
                ingredientDetails: [],
                additives: [],
                additiveDeepDive: [],
                regulatoryFindings: [],
                scoring: { totalScore: 0, riskLevel: 'Unknown', breakdown: ['No ingredients detected.'] },
                healthSummary: null,
                limitations: ['Could not parse ingredients from provided text.']
            } as AnalysisResponse);
        }

        // 2. Detect Additives (Local DB)
        const initialFindings: (AdditiveInfo | null)[] = ingredients.map(ing => detectAdditive(ing));

        // 3. Score & Enrich via Risk Engine
        const { scoring, enrichedAdditives, dataSourceAdded } = await calculateRiskScore(ingredients, initialFindings);

        // 4. AI-Powered Analysis (runs in parallel)
        const validAdditives = (enrichedAdditives as AdditiveInfo[]).filter(a => a !== null);

        const [aiAnalysis, additiveResearch] = await Promise.all([
            analyzeIngredientsWithAI(ingredients, initialFindings),
            deepDiveAdditives(validAdditives)
        ]);

        // 5. Data Sources
        const dataSources = ['RegulationDB (Local)'];
        if (usedAI) dataSources.push('Groq AI (Llama 3.3)');
        if (dataSourceAdded) dataSources.push('OpenFoodFacts');
        if (aiAnalysis.ingredientDetails.some(d => d.source === 'AI Analysis')) {
            dataSources.push('AI Ingredient Analysis');
        }

        // Filter valid findings (deduplicated)
        const findings: AdditiveInfo[] = (enrichedAdditives as AdditiveInfo[])
            .filter((a): a is AdditiveInfo => a !== null)
            .filter((a, index, self) => index === self.findIndex((t) => t.code === a.code));

        const additiveNames = findings.map(f => f.code);

        // 6. Confidence Score
        let confidenceScore = 0.95;
        if (ingredients.length < 3) confidenceScore -= 0.15;
        const suspiciousTokens = ingredients.filter(i => i.length < 3 || /[^a-zA-Z0-9\s(),.-]/.test(i)).length;
        if (suspiciousTokens > 0) confidenceScore -= (0.05 * suspiciousTokens);
        if (ingredients.length > 5 && findings.length === 0) confidenceScore -= 0.10;
        if (aiAnalysis.healthSummary) confidenceScore += 0.03; // AI boost
        confidenceScore = Math.max(0.1, Math.min(confidenceScore, 1.0));

        // 7. Response
        const response: AnalysisResponse = {
            metadata: {
                systemVersion: 'IngreBOARD Research Prototype v2.0',
                version: '2.0.0',
                timestamp: new Date().toISOString(),
                scoringModelVersion: 'v3-ai-risk-model',
                dataSources,
                methodology: 'AI Clean → Parse → Detect → AI Analyze → Deep Dive → Risk Score',
                confidenceScore: parseFloat(confidenceScore.toFixed(2)),
                rawText: rawText,
                cleanedText: correctedText,
                processingFlags: {
                    ocrEngine: (req.body as AnalyzeRequest).ocrEngine || 'None',
                    usedAI,
                    usedOFF: dataSourceAdded
                }
            },
            ingredients,
            ingredientDetails: aiAnalysis.ingredientDetails,
            additives: additiveNames,
            additiveDeepDive: additiveResearch,
            regulatoryFindings: findings,
            scoring,
            healthSummary: aiAnalysis.healthSummary,
            limitations: [
                'AI-Powered Analysis: Results are AI-generated and should be verified with professionals.',
                'OCR Accuracy: Performance depends on image clarity and text recognition quality.',
                'Dynamic Knowledge: Regulatory status and health data are continuously updated.',
                'Not Medical Advice: This tool is for educational purposes only.'
            ]
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Analysis Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default allowCors(handler);
