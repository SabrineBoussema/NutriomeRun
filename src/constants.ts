import { Objective, Item } from './types';

export const OBJECTIVES: Objective[] = [
  {
    id: "immunite",
    title: "Objectif : soutenir l'immunité",
    description: "Cliquez les micronutriments qui renforcent le système immunitaire.",
    targets: ["Vitamine C", "Vitamine D", "Zinc", "Probiotiques"],
    tags: ["immunite"]
  },
  {
    id: "stress",
    title: "Objectif : gérer le stress & le sommeil",
    description: "Cliquez les micronutriments utiles pour la relaxation et le sommeil.",
    targets: ["Magnésium", "Vitamine B-Complex"],
    tags: ["stress"]
  },
  {
    id: "fatigue",
    title: "Objectif : lutter contre la fatigue",
    description: "Cliquez les micronutriments qui aident à réduire la fatigue.",
    targets: ["Fer", "Vitamine B-Complex", "Magnésium"],
    tags: ["fatigue"]
  },
  {
    id: "digestion",
    title: "Objectif : confort digestif",
    description: "Cliquez les micronutriments utiles au microbiote et à la digestion.",
    targets: ["Probiotiques"],
    tags: ["digestion"]
  }
];

export const ITEMS: Item[] = [
  { name: "Vitamine C", tags: ["immunite", "fatigue"], label: "Vitamine" },
  { name: "Vitamine D", tags: ["immunite", "os"], label: "Vitamine" },
  { name: "Zinc", tags: ["immunite", "peau"], label: "Minéral" },
  { name: "Probiotiques", tags: ["digestion", "immunite"], label: "Microbiote" },
  { name: "Magnésium", tags: ["stress", "fatigue"], label: "Minéral" },
  { name: "Vitamine B-Complex", tags: ["stress", "fatigue"], label: "Vitamine" },
  { name: "Fer", tags: ["fatigue", "grossesse"], label: "Minéral" },
  { name: "Fast-food", tags: [], label: "🛑" },
  { name: "Sucre raffiné", tags: [], label: "🛑" },
  { name: "Sédentarité", tags: [], label: "🛑" },
  { name: "Tabac", tags: [], label: "🛑" }
];

export const TOTAL_TIME = 30;
export const SPAWN_INTERVAL = 1600;
