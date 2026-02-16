import type { AnalysisResponse } from '../../api/types';

export const analyzeImage = async (rawText: string, ocrEngine?: string): Promise<AnalysisResponse> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rawText, ocrEngine }),
        });

        if (!response.ok) {
            throw new Error(`Analysis failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data as AnalysisResponse;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
