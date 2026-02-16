/**
 * Research-grade ingredient parser.
 * Isolates ingredient lists from noisy OCR text and cleans them up.
 */

export function parseIngredients(rawText: string): string[] {
    if (!rawText) return [];

    let text = rawText;

    // 1. Identify Start of Ingredients
    // Look for "Ingredients:" or "Contains:" (case insensitive)
    // We capture the position to trim everything before it.
    const startMatch = text.match(/(?:INGREDIENTS?|CONTAINS)\s*[:\-]?\s*/i);
    if (startMatch && startMatch.index !== undefined) {
        text = text.substring(startMatch.index + startMatch[0].length);
    }

    // 2. Identify End of Ingredients (Stop Phrases)
    // Truncate text when we hit any of these keywords that typically signal the next section.
    const stopKeywords = [
        "NUTRITION", "NUTRITION FACTS", "SERVING SIZE", "SERVING_SIZE",
        "BEST BEFORE", "MFD", "MFD\\.", "NET WEIGHT", "NET WT", "NET_WT",
        "FSSAI", "LIC\\.", "LIC\\s+NO", "MARKETED BY", "MANUFACTURED BY",
        "MFG BY", "EXPIRY", "EXP\\.", "BATCH", "USE BY", "PRODUCED IN",
        "ALLERGENS", "ALLERGY ADVICE"
    ];

    // Regex looks for these keywords as whole words or specific patterns
    const stopRegex = new RegExp(`\\b(${stopKeywords.join('|')})`, 'i');

    const endMatch = text.search(stopRegex);
    if (endMatch !== -1) {
        text = text.substring(0, endMatch);
    }

    // 3. Normalization
    text = text
        .replace(/\n/g, ' ')       // Flatten to single line
        .replace(/\s+/g, ' ')      // Collapse multiple spaces
        .replace(/\u00A0/g, ' ')   // Replace non-breaking spaces
        .trim();

    // 4. Smart Split (respecting parentheses)
    // This loop ensures we don't split ingredients that have commas inside parentheses.
    // Example: "Vegetable Oil (Palm, Sunflower)" -> treated as one token.
    const tokens: string[] = [];
    let buffer = '';
    let parenDepth = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '(' || char === '[') {
            parenDepth++;
            buffer += char;
        } else if (char === ')' || char === ']') {
            if (parenDepth > 0) parenDepth--;
            buffer += char;
        } else if ((char === ',' || char === '•' || char === '|' || char === ';' || char === '&') && parenDepth === 0) {
            if (buffer.trim()) tokens.push(buffer.trim());
            buffer = '';
        } else {
            buffer += char;
        }
    }
    // Push the final buffer
    if (buffer.trim()) tokens.push(buffer.trim());

    // 5. Granular Split (extract content from parentheses)
    // For ingredients like "Vegetable Oil (Palm, Sunflower)", we want "Palm" and "Sunflower" as separate tokens.
    const granularTokens: string[] = [];
    tokens.forEach(token => {
        const match = token.match(/^([^(]+)\s*\(([^)]+)\)\s*(.*)$/);
        if (match) {
            const prefix = match[1].trim();
            const content = match[2].trim();
            const suffix = match[3].trim();

            if (prefix) granularTokens.push(prefix);

            // Split nested content by commas, semicolons, or "and"
            const subParts = content.split(/[,;]|and/i).map(p => p.trim()).filter(p => p.length > 0);
            granularTokens.push(...subParts);

            if (suffix) granularTokens.push(suffix);
        } else {
            granularTokens.push(token);
        }
    });

    // 6. Clean Individual Tokens
    const cleanedIngredients = granularTokens.map(token => {
        let clean = token.trim();

        // Remove trailing periods and commas
        clean = clean.replace(/[.,;]+$/, '');

        // Remove leading punctuation artifacts
        clean = clean.replace(/^[.,;:\-*]+/, '');

        // Remove "AND" if it appears at the start (e.g., "AND SALT" -> "SALT")
        clean = clean.replace(/^and\s+/i, '');

        return clean.trim();
    })
        .filter(item => {
            // Filter out invalid or empty items
            if (item.length < 2) return false; // Remove single characters like "."

            // Remove purely numeric/measurement tokens (e.g., "100g", "0.5%", "1%")
            // matches numbers with or without units
            if (/^\d+(\.\d+)?\s*(g|mg|ml|%|kcal|kj)?$/i.test(item)) return false;

            return true;
        });

    // 7. Deduplicate while preserving order
    return [...new Set(cleanedIngredients)];
}

/**
 * Unit Tests Validator
 * Can be called manually to verify parser logic.
 */
export const runParserTests = () => {
    const testCases = [
        {
            name: "Basic List",
            input: "INGREDIENTS: Sugar, Palm Oil, E211. NUTRITION FACTS: ...",
            expected: ["Sugar", "Palm Oil", "E211"]
        },
        {
            name: "With Parentheses (Granular)",
            input: "Ingredients: Vegetable Fat (Palm, Shea), Salt, Sugar.",
            expected: ["Vegetable Fat", "Palm", "Shea", "Salt", "Sugar"]
        },
        {
            name: "Nesting with Ratios",
            input: "INGREDIENTS: Potato, Edible Oil (Palmolein, Rice Bran), Salt (1%).",
            expected: ["Potato", "Edible Oil", "Palmolein", "Rice Bran", "Salt"]
        },
        {
            name: "Stop Words",
            input: "Contains: Wheat, Soy. Marketed By: Some Corp.",
            expected: ["Wheat", "Soy"]
        },
        {
            name: "Messy OCR",
            input: "INGREDIENTS: ..Sugar ,  Water . E330  ",
            expected: ["Sugar", "Water", "E330"]
        }
    ];

    console.log("🧪 Running Ingredient Parser Tests...");
    let passedCount = 0;

    testCases.forEach((tc) => {
        const output = parseIngredients(tc.input);
        const isMatch = JSON.stringify(output) === JSON.stringify(tc.expected);

        if (isMatch) {
            passedCount++;
        } else {
            console.error(`❌ Test '${tc.name}' Failed.`);
            console.error(`   Input: "${tc.input}"`);
            console.error(`   Expected: ${JSON.stringify(tc.expected)}`);
            console.error(`   Got:      ${JSON.stringify(output)}`);
        }
    });

    console.log(`✅ ${passedCount}/${testCases.length} Tests Passed.`);
};
