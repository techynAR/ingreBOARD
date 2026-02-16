import { AdditiveInfo, RiskScoring } from '../types.js';

// Base Risk Contribution by Level (Refined)
const RISK_CONTRIBUTION = {
    'Safe': 0,
    'Unknown': 5,
    'Caution': 15,    // Low/Medium Risk
    'High Risk': 30,
    'Hazardous': 50
};

// Position Weight Multipliers (Decay function)
const getPositionWeight = (index: number): number => {
    if (index === 0) return 1.0;
    if (index === 1) return 0.8;
    if (index === 2) return 0.6;
    return 0.4;
};

// High Risk Ingredients Mapping
const HIGH_RISK_INGREDIENTS: Record<string, number> = {
    'sugar': 20,
    'palm oil': 10,
    'palmolein': 10,
    'palm': 10,
    'trans fat': 15,
    'hydrogenated oil': 15,
    'high fructose corn syrup': 15
};

// OpenFoodFacts Taxonomy URL (Reliable Source)
const ADDITIVES_TAXONOMY_URL = 'https://static.openfoodfacts.org/data/taxonomies/additives.json';

// Global Cache for Taxonomy Data (Serverless Warm Start Optimization)
let cachedTaxonomy: Record<string, any> | null = null;
let taxonomyFetchPromise: Promise<Record<string, any> | null> | null = null;

async function getTaxonomyData(): Promise<Record<string, any> | null> {
    if (cachedTaxonomy) return cachedTaxonomy;
    if (taxonomyFetchPromise) return taxonomyFetchPromise;

    taxonomyFetchPromise = (async () => {
        try {
            console.log(`[OFF] Fetching Taxonomy: ${ADDITIVES_TAXONOMY_URL}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout for larger file

            const response = await fetch(ADDITIVES_TAXONOMY_URL, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn(`[OFF] Taxonomy fetch failed: ${response.status}`);
                return null;
            }

            const data = await response.json();
            cachedTaxonomy = data;
            return data;
        } catch (error) {
            console.error('[OFF] Taxonomy fetch error:', (error as Error).message);
            return null;
        } finally {
            taxonomyFetchPromise = null; // Reset promise if failed, or done
        }
    })();

    return taxonomyFetchPromise;
}

export async function calculateRiskScore(
    ingredients: string[],
    detectedAdditives: (AdditiveInfo | null)[]
): Promise<{ scoring: RiskScoring, enrichedAdditives: (AdditiveInfo | null)[], dataSourceAdded: boolean }> {
    let additiveScore = 0;
    let ingredientScore = 0;
    const breakdown: string[] = [];
    let dataSourceAdded = false;

    // 0. Ensure Taxonomy is Loaded
    const taxonomy = await getTaxonomyData();

    // Enrichment Logic
    const enrichedAdditives = detectedAdditives.map(additive => {
        if (!additive || !taxonomy) return additive;

        // OFF Taxonomy keys are like "en:e330"
        const key = `en:${additive.code.toLowerCase()}`;
        const offInfo = taxonomy[key];

        if (offInfo) {
            dataSourceAdded = true;

            // Extract useful fields
            const name = offInfo.name?.en || offInfo.name?.fr || offInfo.name?.['es'] || additive.name;
            const description = ''; // Taxonomy rarely has long descriptions
            const wikiUrl = offInfo.wikidata ? `https://www.wikidata.org/wiki/${offInfo.wikidata.en || offInfo.wikidata}` : offInfo.wikipedia_url?.en;

            // Vegan/Vegetarian Status: 'yes', 'no', 'maybe', 'unknown'
            const vegan = offInfo.vegan?.en || offInfo.vegan || 'unknown';
            const vegetarian = offInfo.vegetarian?.en || offInfo.vegetarian || 'unknown';

            return {
                ...additive,
                offData: {
                    name,
                    description,
                    wikiUrl,
                    vegan,
                    vegetarian,
                    categories: offInfo.parents || []
                },
                // Update specific metadata if available and confident
                vegan: vegan !== 'unknown' ? vegan : additive.vegan,
                vegetarian: vegetarian !== 'unknown' ? vegetarian : additive.vegetarian
            };
        }
        return additive;
    });

    // Risk Calculation Logic
    ingredients.forEach((ing, index) => {
        const positionWeight = getPositionWeight(index);
        const additive = enrichedAdditives[index];
        const lowerIng = ing.toLowerCase();

        // 1. Additive Risk Calculation
        if (additive) {
            const baseRisk = RISK_CONTRIBUTION[additive.riskLevel] || 0;
            const weightedRisk = baseRisk * positionWeight;

            if (weightedRisk > 0) {
                additiveScore += weightedRisk;
                breakdown.push(`+${weightedRisk.toFixed(1)}: ${additive.code} (${additive.riskLevel}) at position ${index + 1}`);
            }
        }

        // 2. Specific High-Risk Ingredient Rules
        for (const [key, penalty] of Object.entries(HIGH_RISK_INGREDIENTS)) {
            if (lowerIng.includes(key)) {
                let effectivePenalty = penalty * positionWeight;

                if (index === 0 && key === 'sugar') {
                    effectivePenalty = 20;
                    breakdown.push(`+20.0: Sugar is the primary ingredient!`);
                } else if (effectivePenalty > 0) {
                    breakdown.push(`+${effectivePenalty.toFixed(1)}: Contains ${key} at position ${index + 1}`);
                }

                ingredientScore += effectivePenalty;
                break;
            }
        }
    });

    // 3. Cap Additive Impact
    if (additiveScore > 60) {
        breakdown.push(`(Additive score capped at 60 from ${additiveScore.toFixed(1)})`);
        additiveScore = 60;
    }

    // 4. Calculate Final Total
    let totalScore = additiveScore + ingredientScore;
    totalScore = Math.min(Math.round(totalScore), 100);

    // 5. Determine Risk Level Classification
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    if (totalScore <= 20) riskLevel = 'Low';
    else if (totalScore <= 40) riskLevel = 'Moderate';
    else if (totalScore <= 70) riskLevel = 'High';
    else riskLevel = 'Severe';

    return {
        scoring: {
            totalScore,
            riskLevel,
            breakdown
        },
        enrichedAdditives,
        dataSourceAdded
    };
}
