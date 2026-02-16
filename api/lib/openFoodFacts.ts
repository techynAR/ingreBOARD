import { AdditiveInfo, AnalysisResponse } from './types.js';

// In-memory cache to prevent redundant network requests during runtime
const CACHE = new Map<string, Partial<AdditiveInfo>>();

interface OpenFoodFactsResponse {
    code: string;
    display_name_en?: string;
    name?: string;
    compare_to_category?: string;
    wiki_data?: {
        wiki_tag?: string;
        wiki_url?: string;
    };
    vegan?: string; // "yes", "no", "maybe", "unknown"
    vegetarian?: string;
    from_palm_oil?: string;
    overexposure_risk?: string; // "high", "moderate", etc.
    exposure_mean_greater_than_adi?: string;
    toxicity_class?: string;
}

/**
 * Maps OpenFoodFacts risk/toxicity data to our internal RiskLevel.
 */
function mapRiskLevel(data: any): AdditiveInfo['riskLevel'] | undefined {
    if (data.overexposure_risk === 'high' || data.toxicity_class === 'high') return 'High Risk';
    if (data.overexposure_risk === 'moderate') return 'Caution';
    // OFF data is often sparse on 'danger', so we are conservative and return undefined 
    // to let the local expert DB take precedence if OFF is vague.
    return undefined;
}

/**
 * Fetches additive information from OpenFoodFacts (OFF).
 * Returns a partial AdditiveInfo object to be merged with local data.
 */
export async function fetchAdditiveInfo(code: string): Promise<Partial<AdditiveInfo> | null> {
    // 1. Check Cache
    if (CACHE.has(code)) {
        return CACHE.get(code)!;
    }

    try {
        const response = await fetch(`https://world.openfoodfacts.org/additive/${code}.json`);

        if (!response.ok) {
            // 404 or other error
            return null;
        }

        const json = await response.json();

        // OFF returns distinct structure. The additive data is often at the root or under 'additive' key depending on endpoint version.
        // The endpoint /additive/{code}.json usually returns the entity tags.
        // Actually, OFF logic indicates the JSON might be the product search or tag definition.
        // Use proper taxonomy endpoint: https://world.openfoodfacts.org/additive/{code}.json returns the tag definition.

        // We expect the JSON to be the tag data.
        const data = json as OpenFoodFactsResponse;
        const displayName = data.display_name_en || data.name;

        if (!displayName) {
            // Validation failed, probably empty response
            return null;
        }

        // Map fields
        const result: Partial<AdditiveInfo> = {
            description: data.wiki_data?.wiki_tag || `Identified as ${displayName} via OpenFoodFacts.`,
            vegetarian: data.vegan,
            vegan: data.vegan, // OFF often calls the field 'vegan' or 'vegetarian'
        };

        // If OFF has specific risk data, we can try to use it, but local DB is often better curated for "Risk".
        // We will use OFF descriptions primarily.
        const offRisk = mapRiskLevel(data);
        if (offRisk) result.riskLevel = offRisk;

        // Cache success
        CACHE.set(code, result);
        return result;

    } catch (error) {
        console.warn(`[OpenFoodFacts] Failed to fetch data for ${code}:`, error);
        // Return null so we fall back to local DB
        return null;
    }
}
