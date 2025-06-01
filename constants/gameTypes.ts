export type GameType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export const gameTypes: GameType[] = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Find matching animal pairs',
    icon: 'grid',
    route: '/games/memory',
    difficulty: 'easy'
  },
  {
    id: 'quiz',
    name: 'Animal Quiz',
    description: 'Test your animal knowledge',
    icon: 'help-circle',
    route: '/games/quiz',
    difficulty: 'medium'
  },
  {
    id: 'sorting',
    name: 'Animal Sorting',
    description: 'Sort animals by category',
    icon: 'move',
    route: '/games/sorting',
    difficulty: 'medium'
  }
];