import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local so serverless functions can access env vars locally
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Normalizes OCR text using Groq AI (Llama 3.3).
 */
export async function normalizeOCRText(rawText: string): Promise<{ correctedText: string; usedAI: boolean }> {
    const API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

    console.log('[Groq] Key present:', !!API_KEY, '| Input length:', rawText?.length || 0);

    if (!API_KEY) {
        console.warn('[Groq] No API key found. Skipping AI cleanup.');
        return { correctedText: rawText, usedAI: false };
    }

    if (!rawText || rawText.trim().length === 0) {
        return { correctedText: rawText, usedAI: false };
    }

    try {
        const groq = new Groq({ apiKey: API_KEY });

        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are a food label expert. Clean messy OCR text into a comma-separated ingredient list.
RULES:
1. Merge fragmented words (e.g. "Suga r" -> "Sugar").
2. Standardize additives as "Name (EXXX)".
3. Remove non-ingredient noise (weights, %, marketing text).
4. Return ONLY the cleaned comma-separated list. No explanation.`
                },
                {
                    role: 'user',
                    content: rawText
                }
            ],
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1
        });

        let result = chatCompletion.choices[0]?.message?.content || '';
        result = result.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

        if (!result) {
            throw new Error('Empty AI response');
        }

        console.log('[Groq] Cleaned successfully. Output length:', result.length);
        return { correctedText: result, usedAI: true };

    } catch (error) {
        console.error('[Groq] Error:', (error as any).message || error);
        return { correctedText: rawText, usedAI: false };
    }
}
