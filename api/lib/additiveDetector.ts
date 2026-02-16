import { AdditiveInfo } from '../types.js';
import { additiveDatabase } from './regulationDB.js';

/**
 * Normalizes an additive code to a standard format (e.g., "E211").
 */
function normalizeCode(code: string): string {
    const clean = code.replace(/[\s\-\[\]\(\)]/g, '').toUpperCase();
    if (/^\d/.test(clean)) {
        return `E${clean}`;
    }
    return clean;
}

/**
 * Validates if a token is likely an extracted code (e.g., "338", "150d").
 */
function isValidCodeFormat(token: string): boolean {
    // Matches 3-4 digits, optionally followed by a letter (e.g., 150d, 338)
    return /^\d{3,4}[a-z]?$/i.test(token);
}

/**
 * Simple Levenshtein distance for fuzzy matching
 */
function levenshtein(a: string, b: string): number {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

/**
 * Detects if a string contains an additive and returns its info.
 */
export function detectAdditive(ingredient: string): AdditiveInfo | null {
    if (!ingredient) return null;
    const normIngredient = ingredient.toLowerCase().trim();

    // 0. Pre-check: Look for isolated codes in parentheses, e.g., "Acidity Regulator (338)"
    // Captures (338), (E338), (INS 338)
    const parenMatch = normIngredient.match(/\((?:e-?|ins\s*)?(\d{3,4}[a-z]?)\)/i);
    if (parenMatch) {
        const extractedCode = parenMatch[1];
        // Check if this code exists in DB
        const dbMatch = additiveDatabase.find(e => e.code.replace('E', '').toLowerCase() === extractedCode.toLowerCase());
        if (dbMatch) return dbMatch;
    }

    for (const entry of additiveDatabase) {
        // 1. Check by Code (e.g., "E211", "INS 211")
        const codeNumber = entry.code.replace('E', '').toLowerCase();

        // Robust Regex:
        // Matches: "E211", "E-211", "INS 211", "INS211"
        // And importantly, matches if it's strictly a code token
        // We use word boundaries ensuring we don't match "3380" for "338"
        // We do NOT rely on \b before (
        const regex = new RegExp(`(?:\\b|\\()(e-?${codeNumber}|ins\\s*${codeNumber}|${codeNumber})(?:\\b|\\))`, 'i');

        if (regex.test(normIngredient)) {
            // Verify context if just a number (avoid "Energy 338 kJ")
            // If it was matched as "338", ensure it's in parens OR preceded by "ins" OR "e"
            const plainNumberMatch = new RegExp(`\\b${codeNumber}\\b`).test(normIngredient);
            if (plainNumberMatch) {
                // If it's just the number, strictly require it to be in parens or labeled 'ins'/'e'
                // But wait, the main regex `(?:\\b|\\()(e-?${codeNumber}|ins\\s*${codeNumber}|${codeNumber})(?:\\b|\\))`
                // allows just `${codeNumber}` preceded by `(` or `\b`. 
                // If it matched `(338)`, we are good.
                // If it matched ` 338 `, we need to be careful.

                // Let's rely on the parenMatch above for pure numbers usually.
                // But for "INS 338", the regex works.
                // For "E338", the regex works.

                // If the match was pure number NOT in parens/INS/E, we skip unless it looks very specific
                if (!normIngredient.includes(`(${codeNumber})`) &&
                    !normIngredient.includes(`ins`) &&
                    !normIngredient.includes(`e${codeNumber}`)) {
                    // Check for "Agent 338" or "Color 150d" patterns could be added here
                    // For now, accept it if exact match to avoid false negatives, but risk false positives.
                    // Actually, let's trust the regex if it matches E-code or INS.
                } else {
                    return entry;
                }
            } else {
                return entry; // Matched E-code or INS-code variant
            }
        }

        // 2. Check by Name (Exact or Substring)
        if (normIngredient.includes(entry.name.toLowerCase())) {
            return entry;
        }

        // 3. Fuzzy Name Match (for typos)
        // Only run if ingredient word count is small (< 5 words) to avoid false positives in long text
        if (normIngredient.split(' ').length < 6) {
            // Calculate distance on the ingredient string vs entry name
            // We compare against the whole ingredient string to assume it's "Tartrazin" instead of "Tartrazine"
            // Threshold: 2 edits max, and length > 4 to avoid short false matches
            if (entry.name.length > 4) {
                const dist = levenshtein(normIngredient, entry.name.toLowerCase());
                if (dist <= 2) return entry;
            }
        }
    }

    return null;
}
