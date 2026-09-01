import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { IngredientDetail, AdditiveDeepDive, AdditiveInfo, RegulatoryStatus } from '../types.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function getGroqClient(): Groq | null {
    const key = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    if (!key) return null;
    return new Groq({ apiKey: key });
}

/**
 * Uses Groq AI to analyze each ingredient for safety, health, allergy, and categorization.
 */
export async function analyzeIngredientsWithAI(
    ingredients: string[],
    existingAdditives: (AdditiveInfo | null)[]
): Promise<{ ingredientDetails: IngredientDetail[]; healthSummary: any }> {
    const groq = getGroqClient();

    if (!groq || ingredients.length === 0) {
        return {
            ingredientDetails: ingredients.map(name => ({
                name,
                category: 'Unknown' as const,
                safetyLevel: 'Safe' as const,
                healthNotes: '',
                allergyWarnings: [],
                isAdditive: false,
                source: 'Local DB' as const
            })),
            healthSummary: null
        };
    }

    try {
        const knownAdditives = existingAdditives
            .filter(a => a !== null)
            .map(a => a!.code)
            .join(', ');

        const response = await groq.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'system',
                    content: `You are a food science expert and nutritionist. Analyze each ingredient and return STRICT JSON.
You MUST respond with ONLY valid JSON, no markdown, no explanation.

Response format:
{
  "ingredients": [
    {
      "name": "Sugar",
      "category": "Natural|Processed|Synthetic|Additive|Allergen|Unknown",
      "safetyLevel": "Safe|Generally Safe|Use with Caution|Potentially Harmful|Harmful",
      "healthNotes": "Brief health impact (1-2 sentences)",
      "allergyWarnings": ["List of allergy warnings if any"],
      "dailyLimitInfo": "Safe daily intake if applicable",
      "isAdditive": false,
      "additiveCode": "E-code if it's an additive, null otherwise"
    }
  ],
  "healthSummary": {
    "overallVerdict": "One sentence overall health verdict for this product",
    "allergyAlerts": ["Critical allergy alerts"],
    "dietaryFlags": ["Contains Gluten", "Not Vegan", etc],
    "recommendations": ["2-3 actionable health recommendations"]
  }
}`
                },
                {
                    role: 'user',
                    content: `Analyze these ingredients: ${ingredients.join(', ')}
${knownAdditives ? `Known additives already detected: ${knownAdditives}` : ''}`
                }
            ],
            temperature: 0.1,
            max_tokens: 3000,
            top_p: 1,
            response_format: { type: 'json_object' }
        });

        const rawContent = response.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(rawContent);

        const ingredientDetails: IngredientDetail[] = (parsed.ingredients || []).map((item: any, idx: number) => ({
            name: item.name || ingredients[idx] || 'Unknown',
            category: item.category || 'Unknown',
            safetyLevel: item.safetyLevel || 'Safe',
            healthNotes: item.healthNotes || '',
            allergyWarnings: item.allergyWarnings || [],
            dailyLimitInfo: item.dailyLimitInfo || undefined,
            isAdditive: item.isAdditive || false,
            additiveCode: item.additiveCode || undefined,
            source: 'AI Analysis' as const
        }));

        // Ensure we have details for ALL ingredients
        while (ingredientDetails.length < ingredients.length) {
            ingredientDetails.push({
                name: ingredients[ingredientDetails.length],
                category: 'Unknown',
                safetyLevel: 'Safe',
                healthNotes: '',
                allergyWarnings: [],
                isAdditive: false,
                source: 'AI Analysis'
            });
        }

        const healthSummary = parsed.healthSummary || {
            overallVerdict: 'Analysis completed.',
            allergyAlerts: [],
            dietaryFlags: [],
            recommendations: []
        };

        console.log('[AI Analysis] Analyzed', ingredientDetails.length, 'ingredients');
        return { ingredientDetails, healthSummary };

    } catch (error) {
        console.error('[AI Analysis] Failed:', (error as any).message);
        return {
            ingredientDetails: ingredients.map(name => ({
                name,
                category: 'Unknown' as const,
                safetyLevel: 'Safe' as const,
                healthNotes: '',
                allergyWarnings: [],
                isAdditive: false,
                source: 'Local DB' as const
            })),
            healthSummary: null
        };
    }
}

/**
 * Deep-dives into INS/E-code additives using Groq AI.
 */
export async function deepDiveAdditives(
    additives: AdditiveInfo[]
): Promise<AdditiveDeepDive[]> {
    const groq = getGroqClient();
    if (!groq || additives.length === 0) return [];

    try {
        const additiveList = additives.map(a => `${a.code} (${a.name})`).join(', ');

        const response = await groq.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                {
                    role: 'system',
                    content: `You are a food science researcher specializing in food additives. Provide detailed analysis of each additive. Return ONLY valid JSON.

Response format:
{
  "additives": [
    {
      "code": "E211",
      "name": "Sodium Benzoate",
      "chemicalName": "Sodium salt of benzoic acid",
      "derivedFrom": "What it's made from (e.g. 'Synthesized from benzoic acid, originally found in berries')",
      "function": "Preservative|Colorant|Emulsifier|Stabilizer|Flavoring|Antioxidant|Sweetener|Thickener|Acidity Regulator|Other",
      "healthImpact": "Detailed health impact (2-3 sentences)",
      "safetyLevel": "Safe|Generally Safe|Use with Caution|Potentially Harmful|Harmful",
      "dailyIntakeLimit": "ADI: 0-5 mg/kg body weight (WHO)",
      "commonProducts": ["soft drinks", "pickles"],
      "allergyRisk": "Low|Moderate|High - with explanation",
      "bannedIn": ["Countries where banned"],
      "alternatives": ["Natural alternatives if any"]
    }
  ]
}`
                },
                {
                    role: 'user',
                    content: `Deep-dive these food additives: ${additiveList}`
                }
            ],
            temperature: 0.1,
            max_tokens: 3000,
            top_p: 1,
            response_format: { type: 'json_object' }
        });

        const rawContent = response.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(rawContent);

        const deepDives: AdditiveDeepDive[] = (parsed.additives || []).map((item: any, idx: number) => {
            const original = additives[idx];
            return {
                code: item.code || original?.code || 'Unknown',
                name: item.name || original?.name || 'Unknown',
                chemicalName: item.chemicalName || undefined,
                derivedFrom: item.derivedFrom || 'Unknown origin',
                function: item.function || 'Unknown',
                healthImpact: item.healthImpact || '',
                safetyLevel: item.safetyLevel || 'Generally Safe',
                dailyIntakeLimit: item.dailyIntakeLimit || undefined,
                commonProducts: item.commonProducts || [],
                allergyRisk: item.allergyRisk || 'Low',
                bannedIn: item.bannedIn || [],
                alternatives: item.alternatives || [],
                regulatoryStatus: original?.status || { india: 'Unknown', eu: 'Unknown', usa: 'Unknown' }
            };
        });

        console.log('[AI Deep Dive] Researched', deepDives.length, 'additives');
        return deepDives;

    } catch (error) {
        console.error('[AI Deep Dive] Failed:', (error as any).message);
        return [];
    }
}
