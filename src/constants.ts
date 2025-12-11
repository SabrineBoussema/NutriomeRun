import { Objective, Item } from './types';

// 1) ITEMS : tous les micronutriments + tags homogènes
export const ITEMS: Item[] = [
  // ✅ Micronutriments / facteurs "positifs"
  { name: 'Vitamine C',         tags: ['immunite', 'fatigue', 'antioxydant'],  label: 'Vitamine' },
  { name: 'Vitamine D',         tags: ['immunite', 'os'],                      label: 'Vitamine' },
  { name: 'Vitamine E',         tags: ['antioxydant'],                         label: 'Vitamine' },
  { name: 'Vitamine B-Complex', tags: ['stress', 'fatigue'],                   label: 'Vitamine' },
  { name: 'Zinc',               tags: ['immunite', 'antioxydant'],             label: 'Minéral' },
  { name: 'Sélénium',           tags: ['immunite', 'antioxydant'],             label: 'Minéral' },
  { name: 'Fer',                tags: ['fatigue'],                             label: 'Minéral' },
  { name: 'Magnésium',          tags: ['stress', 'fatigue'],                   label: 'Minéral' },
  { name: 'Probiotiques',       tags: ['digestion', 'immunite'],               label: 'Microbiote' },
  { name: 'Omega-3',            tags: ['stress'],                              label: 'Acides gras essentiels' },

  // 🚫 Faux / facteurs défavorables : aucune des tags "objectifs"
  { name: 'Fast-food',          tags: [], label: '🛑' },
  { name: 'Sucre raffiné',      tags: [], label: '🛑' },
  { name: 'Sédentarité',        tags: [], label: '🛑' },
  { name: 'Tabac',              tags: [], label: '🛑' }
];

// 2) Config minimale des objectifs
type ObjectiveConfig = {
  id: string;
  title: string;
  description: string;
  mainTag: string;
};

const OBJECTIVE_CONFIGS: ObjectiveConfig[] = [
  {
    id: 'immunite',
    title: "Objectif : soutenir l'immunité",
    description:
      "Cliquez sur les micronutriments qui renforcent le système immunitaire (surtout en période d’infections saisonnières). Évitez les faux amis : Fast-food, sucre raffiné, tabac…",
    mainTag: 'immunite'
  },
  {
    id: 'stress',
    title: 'Objectif : gérer le stress & le sommeil',
    description:
      'Cliquez sur les micronutriments utiles pour la relaxation, la gestion du stress et un sommeil de qualité. Attention aux habitudes qui les perturbent (café tardif, tabac, sédentarité…).',
    mainTag: 'stress'
  },
  {
    id: 'fatigue',
    title: 'Objectif : lutter contre la fatigue',
    description:
      'Cliquez sur les micronutriments qui aident à réduire la fatigue physique et mentale. Ne vous laissez pas piéger par les faux boosters comme le Fast-food ou le sucre raffiné.',
    mainTag: 'fatigue'
  },
  {
    id: 'digestion',
    title: 'Objectif : confort digestif',
    description:
      'Cliquez sur les micronutriments utiles au microbiote, au confort digestif et à un transit harmonieux.',
    mainTag: 'digestion'
  },
  {
    id: 'antioxydants',
    title: 'Objectif : protection cellulaire & antioxydants',
    description:
      'Cliquez sur les micronutriments qui protègent les cellules du stress oxydatif (peau, yeux, cœur, cerveau…).',
    mainTag: 'antioxydant'
  }
];

// 3) OBJECTIVES : générés automatiquement à partir des tags
export const OBJECTIVES: Objective[] = OBJECTIVE_CONFIGS.map(cfg => {
  const relatedItems = ITEMS.filter(item => item.tags.includes(cfg.mainTag));

  return {
    id: cfg.id,
    title: cfg.title,
    description: cfg.description,
    targets: relatedItems.map(item => item.name),
    tags: [cfg.mainTag]
  };
});

export const TOTAL_TIME = 30;
export const SPAWN_INTERVAL = 1600;
