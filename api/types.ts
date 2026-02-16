export type RiskLevel = 'Safe' | 'Caution' | 'High Risk' | 'Hazardous' | 'Unknown';

export interface RegulatoryStatus {
    india: 'Permitted' | 'Restricted' | 'Banned' | 'Unknown';
    eu: 'Permitted' | 'Restricted' | 'Banned' | 'Unknown';
    usa: 'GRAS' | 'Permitted' | 'Restricted' | 'Banned' | 'Unknown'; // GRAS: Generally Recognized As Safe
}

export interface AdditiveInfo {
    code: string;
    name: string;
    riskLevel: RiskLevel;
    description: string;
    status: RegulatoryStatus;
    vegetarian?: string;
    vegan?: string;
    offData?: {
        name: string;
        description: string;
        wikiUrl?: string;
        vegan?: string;
        vegetarian?: string;
        categories?: string[];
    };
}

// NEW: Rich AI-powered ingredient detail
export interface IngredientDetail {
    name: string;
    category: 'Natural' | 'Processed' | 'Synthetic' | 'Additive' | 'Allergen' | 'Unknown';
    safetyLevel: 'Safe' | 'Generally Safe' | 'Use with Caution' | 'Potentially Harmful' | 'Harmful';
    healthNotes: string;
    allergyWarnings: string[];
    dailyLimitInfo?: string;
    isAdditive: boolean;
    additiveCode?: string; // E-code if applicable
    source?: 'Local DB' | 'AI Analysis' | 'OpenFoodFacts';
}

// NEW: Deep-dive on INS/Additives
export interface AdditiveDeepDive {
    code: string;
    name: string;
    chemicalName?: string;
    derivedFrom: string;
    function: string; // e.g. "Preservative", "Color", "Emulsifier"
    healthImpact: string;
    safetyLevel: 'Safe' | 'Generally Safe' | 'Use with Caution' | 'Potentially Harmful' | 'Harmful';
    dailyIntakeLimit?: string;
    commonProducts: string[];
    allergyRisk: string;
    bannedIn: string[];
    alternatives?: string[];
    regulatoryStatus: RegulatoryStatus;
}

export interface IngredientAnalysis {
    original: string;
    cleaned: string;
    isAdditive: boolean;
    additiveInfo?: AdditiveInfo;
    riskScore: number;
}

export interface RiskScoring {
    totalScore: number; // 0 to 100, where 100 is highest risk
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Unknown';
    breakdown: string[];
}

export interface AnalysisResponse {
    metadata: {
        productInfo?: {
            name: string;
            brand?: string;
            categories?: string[];
            imageUrl?: string;
            nutriscore?: string;
            novascore?: number;
            ecoscore?: string;
        };
        systemVersion: string;
        version: string;
        timestamp: string;
        scoringModelVersion: string;
        dataSources: string[];
        methodology: string;
        confidenceScore: number; // 0-1 scale
        rawText?: string;
        cleanedText?: string;
        processingFlags?: {
            ocrEngine?: 'Tesseract' | 'OCR.space' | 'OFF' | 'None';
            usedAI: boolean;
            usedOFF: boolean;
        };
    };
    ingredients: string[];
    ingredientDetails?: IngredientDetail[];       // NEW
    additives: string[];
    additiveDeepDive?: AdditiveDeepDive[];         // NEW
    regulatoryFindings: AdditiveInfo[];
    scoring: RiskScoring;
    healthSummary?: {                              // NEW
        overallVerdict: string;
        allergyAlerts: string[];
        dietaryFlags: string[];                    // e.g. "Contains Gluten", "Not Vegan"
        recommendations: string[];
    };
    limitations: string[];
}

export interface AnalyzeRequest {
    rawText: string;
    ocrEngine?: 'Tesseract' | 'OCR.space' | 'OFF' | 'None';
}
