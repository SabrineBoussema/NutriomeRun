import { Objective, Item } from "./types";

/**
 * Convention:
 * - tags = mots simples, sans accents, en minuscules
 * - mauvais items: tag = ['junk'] (pas [])
 *   => ça permet au GameScreen de distinguer clairement "mauvais"
 */

export const ITEMS: Item[] = [
  // ✅ Immunité
  { name: "Vitamine C", tags: ["immunite", "fatigue", "antioxydant"], label: "Vitamine" },
  { name: "Vitamine D", tags: ["immunite", "os"], label: "Vitamine" },
  { name: "Zinc", tags: ["immunite", "antioxydant"], label: "Minéral" },
  { name: "Sélénium", tags: ["immunite", "antioxydant"], label: "Minéral" },

  // ✅ Stress / Sommeil
  { name: "Magnésium", tags: ["stress", "fatigue", "sommeil"], label: "Minéral" },
  { name: "Vitamine B-Complex", tags: ["stress", "fatigue"], label: "Vitamine" },
  { name: "Omega-3", tags: ["stress", "cerveau", "anti_inflammatoire"], label: "Acides gras essentiels" },

  // ✅ Fatigue
  { name: "Fer", tags: ["fatigue"], label: "Minéral" },

  // ✅ Digestion / Microbiote
  { name: "Probiotiques", tags: ["digestion", "microbiote", "immunite"], label: "Microbiote" },
  { name: "Prébiotiques", tags: ["digestion", "microbiote"], label: "Fibres" },

  // ✅ Antioxydants
  { name: "Vitamine E", tags: ["antioxydant"], label: "Vitamine" },

  // 🚫 Faux / défavorables (toujours taggés junk)
  { name: "Fast-food", tags: ["junk"], label: "🛑" },
  { name: "Sucre raffiné", tags: ["junk"], label: "🛑" },
  { name: "Sédentarité", tags: ["junk"], label: "🛑" },
  { name: "Tabac", tags: ["junk"], label: "🛑" },
];

// 2) Config objectifs
type ObjectiveConfig = {
  id: string;
  title: string;
  description: string;
  mainTag: string;
};

const OBJECTIVE_CONFIGS: ObjectiveConfig[] = [
  {
    id: "immunite",
    title: "Objectif : soutenir l'immunité",
    description:
      "Cliquez sur les micronutriments qui renforcent le système immunitaire. Évitez les faux amis (fast-food, sucre, tabac…).",
    mainTag: "immunite",
  },
  {
    id: "stress",
    title: "Objectif : gérer le stress & le sommeil",
    description:
      "Cliquez sur les micronutriments utiles pour la relaxation et un sommeil de qualité.",
    mainTag: "stress",
  },
  {
    id: "fatigue",
    title: "Objectif : lutter contre la fatigue",
    description:
      "Cliquez sur les micronutriments qui aident à réduire la fatigue physique et mentale.",
    mainTag: "fatigue",
  },
  {
    id: "digestion",
    title: "Objectif : confort digestif",
    description:
      "Cliquez sur les micronutriments utiles au microbiote, au confort digestif et à un transit harmonieux.",
    mainTag: "digestion",
  },
  {
    id: "antioxydant",
    title: "Objectif : protection cellulaire & antioxydants",
    description:
      "Cliquez sur les micronutriments qui protègent les cellules du stress oxydatif.",
    mainTag: "antioxydant",
  },
];

// 3) Génération des objectifs + sécurité si un objectif n’a pas assez de cibles
export const OBJECTIVES: Objective[] = OBJECTIVE_CONFIGS.map((cfg) => {
  const relatedItems = ITEMS.filter((item) => item.tags.includes(cfg.mainTag));
  const targets = relatedItems.map((item) => item.name);

  return {
    id: cfg.id,
    title: cfg.title,
    description: cfg.description,
    targets,
    tags: [cfg.mainTag],
  };
});

export const TOTAL_TIME = 30;

// ✅ plus fluide (plus de chances d’avoir des bulles avant la fin)
export const SPAWN_INTERVAL = 1400;
