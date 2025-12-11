export interface Objective {
  id: string;
  title: string;
  description: string;
  targets: string[];
  tags: string[];
}

export interface Item {
  name: string;
  tags: string[];
  label: string;
}

export type GameScreen = 'intro' | 'rewards' | 'game' | 'result';
