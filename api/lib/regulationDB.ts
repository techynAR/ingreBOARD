import { AdditiveInfo } from '../types.js';

export const additiveDatabase: AdditiveInfo[] = [
    // Coloring Agents (E100-E199)
    { code: 'E100', name: 'Curcumin', riskLevel: 'Safe', description: 'Natural yellow color from turmeric.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E101', name: 'Riboflavin', riskLevel: 'Safe', description: 'Vitamin B2, yellow color.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E102', name: 'Tartrazine', riskLevel: 'High Risk', description: 'Synthetic yellow dye. linked to hyperactivity in children and allergies.', status: { india: 'Restricted', eu: 'Restricted', usa: 'Permitted' } },
    { code: 'E104', name: 'Quinoline Yellow', riskLevel: 'Caution', description: 'Synthetic yellow dye. Banned in USA and Japan.', status: { india: 'Restricted', eu: 'Permitted', usa: 'Banned' } },
    { code: 'E110', name: 'Sunset Yellow FCF', riskLevel: 'High Risk', description: 'Orange dye. Possible allergen and linked to hyperactivity.', status: { india: 'Permitted', eu: 'Restricted', usa: 'Permitted' } },
    { code: 'E120', name: 'Carmine', riskLevel: 'Caution', description: 'Red color from insects. Allergenic potential. Not vegetarian.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' }, vegan: 'no', vegetarian: 'no' },
    { code: 'E122', name: 'Azorubine', riskLevel: 'Caution', description: 'Red dye. Banned in USA, Canada, Japan.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Banned' } },
    { code: 'E123', name: 'Amaranth', riskLevel: 'Hazardous', description: 'Dark red dye. Banned in USA due to cancer links.', status: { india: 'Permitted', eu: 'Restricted', usa: 'Banned' } },
    { code: 'E124', name: 'Ponceau 4R', riskLevel: 'Caution', description: 'Red synthetic color. Linked to hyperactivity.', status: { india: 'Permitted', eu: 'Restricted', usa: 'Banned' } },
    { code: 'E127', name: 'Erythrosine', riskLevel: 'Caution', description: 'Red dye. Linked to thyroid tumors in rats.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Restricted' } },
    { code: 'E129', name: 'Allura Red AC', riskLevel: 'Caution', description: 'Red dye. Linked to hyperactivity.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E132', name: 'Indigotine', riskLevel: 'Caution', description: 'Blue synthetic dye. Can cause nausea.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E133', name: 'Brilliant Blue FCF', riskLevel: 'Caution', description: 'Blue synthetic dye. Generally safe but banned in some countries.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E140', name: 'Chlorophylls', riskLevel: 'Safe', description: 'Natural green color from plants.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E141', name: 'Copper Complexes of Chlorophylls', riskLevel: 'Safe', description: 'Stable green color.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E150a', name: 'Plain Caramel', riskLevel: 'Safe', description: 'Basic caramel color.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E150c', name: 'Ammonia Caramel', riskLevel: 'Caution', description: 'Caramel color produced with ammonia. Immunotoxicity concerns.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E150d', name: 'Sulphite Ammonia Caramel', riskLevel: 'High Risk', description: 'Dark brown coloring. Contains 4-MEI, a potential carcinogen.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Restricted' } },
    { code: 'E153', name: 'Vegetable Carbon', riskLevel: 'Safe', description: 'Black color from charred vegetable matter.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Banned' } }, // Banned in US as additive
    { code: 'E160a', name: 'Carotenes', riskLevel: 'Safe', description: 'Orange/yellow pigment (provitamin A).', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E160b', name: 'Annatto', riskLevel: 'Caution', description: 'Natural orange color. Can cause allergies.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E162', name: 'Beetroot Red', riskLevel: 'Safe', description: 'Natural red color from beets.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E163', name: 'Anthocyanins', riskLevel: 'Safe', description: 'Natural red/purple/blue colors from plants.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E170', name: 'Calcium Carbonate', riskLevel: 'Safe', description: 'White color/calcium source.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E171', name: 'Titanium Dioxide', riskLevel: 'Hazardous', description: 'White pigment. Banned in EU as food additive due to genotoxicity concerns.', status: { india: 'Permitted', eu: 'Banned', usa: 'Permitted' } },
    { code: 'E172', name: 'Iron Oxides', riskLevel: 'Safe', description: 'Red/yellow/black pigments.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },

    // Preservatives (E200-E299)
    { code: 'E200', name: 'Sorbic Acid', riskLevel: 'Safe', description: 'Preservative against mold.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E202', name: 'Potassium Sorbate', riskLevel: 'Safe', description: 'Preservative found in cheese, wine, etc.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E210', name: 'Benzoic Acid', riskLevel: 'Caution', description: 'Preservative. Can cause allergic reactions.', status: { india: 'Restricted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E211', name: 'Sodium Benzoate', riskLevel: 'High Risk', description: 'Preservative. Can form benzene (carcinogen) when combined with Vitamin C.', status: { india: 'Restricted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E220', name: 'Sulphur Dioxide', riskLevel: 'Caution', description: 'Preservative/Antioxidant. Common allergen (asthma trigger).', status: { india: 'Permitted', eu: 'Permitted', usa: 'Restricted' } },
    { code: 'E223', name: 'Sodium Metabisulphite', riskLevel: 'Caution', description: 'Preservative. Can trigger asthma.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E234', name: 'Nisin', riskLevel: 'Safe', description: 'Natural antimicrobial peptide.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E250', name: 'Sodium Nitrite', riskLevel: 'Hazardous', description: 'Preservative in meats. Linked to increased risk of cancer.', status: { india: 'Restricted', eu: 'Restricted', usa: 'Restricted' } },
    { code: 'E251', name: 'Sodium Nitrate', riskLevel: 'High Risk', description: 'Preservative. Can convert to nitrite.', status: { india: 'Restricted', eu: 'Permitted', usa: 'Restricted' } },
    { code: 'E252', name: 'Potassium Nitrate', riskLevel: 'High Risk', description: 'Preservative.', status: { india: 'Restricted', eu: 'Permitted', usa: 'Restricted' } },
    { code: 'E260', name: 'Acetic Acid', riskLevel: 'Safe', description: 'Vinegar component. Safe.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E270', name: 'Lactic Acid', riskLevel: 'Safe', description: 'Natural preservative/acidifier.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E282', name: 'Calcium Propionate', riskLevel: 'Safe', description: 'Bread preservative to prevent mold. Generally safe but linked to some behavioral issues in studies.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E296', name: 'Malic Acid', riskLevel: 'Safe', description: 'Acid found in apples.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },

    // Antioxidants & Acidity Regulators (E300-E399)
    { code: 'E300', name: 'Ascorbic Acid (Vitamin C)', riskLevel: 'Safe', description: 'Vitamin C. Antioxidant.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E306', name: 'Tocopherol-rich extract', riskLevel: 'Safe', description: 'Natural Vitamin E.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E310', name: 'Propyl Gallate', riskLevel: 'Caution', description: 'Synthetic antioxidant. Possible allergen.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E319', name: 'TBHQ', riskLevel: 'High Risk', description: 'Tert-Butylhydroquinone. Linked to immune system damage in animal studies.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E320', name: 'BHA', riskLevel: 'High Risk', description: 'Butylated Hydroxyanisole. Possible carcinogen.', status: { india: 'Restricted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E321', name: 'BHT', riskLevel: 'High Risk', description: 'Butylated Hydroxytoluene. Linked to cancer risk.', status: { india: 'Restricted', eu: 'Restricted', usa: 'Permitted' } },
    { code: 'E322', name: 'Lecithins', riskLevel: 'Safe', description: 'Emulsifier, often from soy or eggs. Generally safe.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E330', name: 'Citric Acid', riskLevel: 'Safe', description: 'Acidifier and preservative found in citrus fruits.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E331', name: 'Sodium Citrates', riskLevel: 'Safe', description: 'Acidity regulator.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E338', name: 'Phosphoric Acid', riskLevel: 'Caution', description: 'Acidity regulator in colas. Linked to lower bone density.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E339', name: 'Sodium Phosphates', riskLevel: 'Caution', description: 'Emulsifier. High phosphate intake may harm kidneys.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E340', name: 'Potassium Phosphates', riskLevel: 'Caution', description: 'Stabilizer. High intake concerns.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E341', name: 'Calcium Phosphates', riskLevel: 'Safe', description: 'Raising agent/mineral source.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },

    // Thickeners, Stabilizers, Emulsifiers (E400-E499)
    { code: 'E400', name: 'Alginic Acid', riskLevel: 'Safe', description: 'Thickener from seaweed.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E406', name: 'Agar', riskLevel: 'Safe', description: 'Vegetable gelatin substitute.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E407', name: 'Carrageenan', riskLevel: 'Caution', description: 'Thickener/Stabilizer from seaweed. Linked to digestive inflammation.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E410', name: 'Locust Bean Gum', riskLevel: 'Safe', description: 'Thickener from seeds.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E412', name: 'Guar Gum', riskLevel: 'Safe', description: 'Thickener from guar beans. High doses can cause gas.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E414', name: 'Gum Arabic', riskLevel: 'Safe', description: 'Natural gum.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E415', name: 'Xanthan Gum', riskLevel: 'Safe', description: 'Thickener from fermented sugar.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E420', name: 'Sorbitol', riskLevel: 'Caution', description: 'Sugar alcohol. Can have laxative effect.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E422', name: 'Glycerol', riskLevel: 'Safe', description: 'Humectant/Sweetener.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E433', name: 'Polysorbate 80', riskLevel: 'Caution', description: 'Emulsifier. Linked to gut inflammation in mice.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E440', name: 'Pectins', riskLevel: 'Safe', description: 'Gelling agent from fruit.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E450', name: 'Diphosphates', riskLevel: 'Caution', description: 'Emulsifier/Raising agent. High phosphate concern.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E451', name: 'Triphosphates', riskLevel: 'Caution', description: 'Emulsifier. High phosphate concern.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E452', name: 'Polyphosphates', riskLevel: 'Caution', description: 'Emulsifier.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E460', name: 'Cellulose', riskLevel: 'Safe', description: 'Fiber/Anti-caking.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E466', name: 'CMC (Carboxymethylcellulose)', riskLevel: 'Caution', description: 'Thickener. Linked to gut microbiome changes.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E471', name: 'Mono- and Diglycerides of Fatty Acids', riskLevel: 'Safe', description: 'Common emulsifier. Often from plant oils but can be animal-derived.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E476', name: 'PGPR', riskLevel: 'Safe', description: 'Polyglycerol polyricinoleate. Emulsifier used in chocolate.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },

    // pH Regulators, Anti-caking (E500-E599)
    { code: 'E500', name: 'Sodium Carbonates', riskLevel: 'Safe', description: 'Raising agent/Baking soda.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E503', name: 'Ammonium Carbonates', riskLevel: 'Safe', description: 'Raising agent.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E508', name: 'Potassium Chloride', riskLevel: 'Safe', description: 'Salt substitute.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E510', name: 'Ammonium Chloride', riskLevel: 'Safe', description: 'Flavor/Firming agent.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E551', name: 'Silicon Dioxide', riskLevel: 'Safe', description: 'Anti-caking agent (sand/glass component, but safe in food form).', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E553b', name: 'Talc', riskLevel: 'Caution', description: 'Anti-caking agent. Concerns about asbestos contamination (though food grade is purified).', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },

    // Flavor Enhancers (E600-E699)
    { code: 'E621', name: 'Monosodium Glutamate', riskLevel: 'Caution', description: 'Flavor enhancer (MSG). Can cause adverse reactions in sensitive people.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E627', name: 'Disodium Guanylate', riskLevel: 'Safe', description: 'Flavor enhancer. Often used with MSG.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E631', name: 'Disodium Inosinate', riskLevel: 'Safe', description: 'Flavor enhancer. Often from meat/fish (non-veg concern).', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E635', name: 'Disodium Ribonucleotides', riskLevel: 'Safe', description: 'Flavor enhancer mixture.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },

    // Sweeteners & Glazing (E900-E999)
    { code: 'E900', name: 'Dimethyl Polysiloxane', riskLevel: 'Caution', description: 'Anti-foaming agent. Permitted in limited quantities.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E901', name: 'Beeswax', riskLevel: 'Safe', description: 'Glazing agent.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' }, vegan: 'no', vegetarian: 'yes' },
    { code: 'E903', name: 'Carnauba Wax', riskLevel: 'Safe', description: 'Plant wax.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E904', name: 'Shellac', riskLevel: 'Safe', description: 'Insect-derived resin. Glazing agent.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' }, vegan: 'no', vegetarian: 'no' },
    { code: 'E950', name: 'Acesulfame K', riskLevel: 'Caution', description: 'Artificial sweetener.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E951', name: 'Aspartame', riskLevel: 'Caution', description: 'Artificial sweetener. Controversial safety profile.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E952', name: 'Cyclamate', riskLevel: 'High Risk', description: 'Artificial sweetener. Banned in USA.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Banned' } },
    { code: 'E954', name: 'Saccharin', riskLevel: 'Caution', description: 'Artificial sweetener. Once linked to cancer in rats, but delisted as carcinogen.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E955', name: 'Sucralose', riskLevel: 'Safe', description: 'Splenda. Generally safe.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },
    { code: 'E960', name: 'Steviol Glycosides', riskLevel: 'Safe', description: 'Natural sweetener from Stevia.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },

    // Modified Starches (E1400+)
    { code: 'E1400', name: 'Dextrins', riskLevel: 'Safe', description: 'Thickener.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
    { code: 'E1422', name: 'Acetylated Distarch Adipate', riskLevel: 'Safe', description: 'Modified starch.', status: { india: 'Permitted', eu: 'Permitted', usa: 'Permitted' } },

    // Others
    { code: 'E1510', name: 'Ethanol', riskLevel: 'Caution', description: 'Alcohol. Used as carrier.', status: { india: 'Permitted', eu: 'Permitted', usa: 'GRAS' } },
];

export const highRiskIngredients = [
    'Sugar',
    'High Fructose Corn Syrup',
    'Palm Oil',
    'Hydrogenated Vegetable Oil',
    'Trans Fat',
    'Interesterified Fat',
    'Carrageenan',
    'Artificial Flavor',
    'Corn Syrup'
];
