import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GameStats = {
  gamesPlayed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  memoryHighScore: number;
  quizHighScore: number;
  animalsDiscovered: string[];
};

type GameState = {
  stats: GameStats;
  incrementGamesPlayed: () => void;
  incrementCorrectAnswers: () => void;
  incrementIncorrectAnswers: () => void;
  updateMemoryHighScore: (score: number) => void;
  updateQuizHighScore: (score: number) => void;
  discoverAnimal: (animalId: string) => void;
  resetStats: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      stats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        memoryHighScore: 0,
        quizHighScore: 0,
        animalsDiscovered: [],
      },
      incrementGamesPlayed: () => 
        set((state) => ({
          stats: {
            ...state.stats,
            gamesPlayed: state.stats.gamesPlayed + 1,
          },
        })),
      incrementCorrectAnswers: () => 
        set((state) => ({
          stats: {
            ...state.stats,
            correctAnswers: state.stats.correctAnswers + 1,
          },
        })),
      incrementIncorrectAnswers: () => 
        set((state) => ({
          stats: {
            ...state.stats,
            incorrectAnswers: state.stats.incorrectAnswers + 1,
          },
        })),
      updateMemoryHighScore: (score: number) => 
        set((state) => ({
          stats: {
            ...state.stats,
            memoryHighScore: Math.max(state.stats.memoryHighScore, score),
          },
        })),
      updateQuizHighScore: (score: number) => 
        set((state) => ({
          stats: {
            ...state.stats,
            quizHighScore: Math.max(state.stats.quizHighScore, score),
          },
        })),
      discoverAnimal: (animalId: string) => 
        set((state) => ({
          stats: {
            ...state.stats,
            animalsDiscovered: state.stats.animalsDiscovered.includes(animalId)
              ? state.stats.animalsDiscovered
              : [...state.stats.animalsDiscovered, animalId],
          },
        })),
      resetStats: () =>
        set({
          stats: {
            gamesPlayed: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            memoryHighScore: 0,
            quizHighScore: 0,
            animalsDiscovered: [],
          },
        }),
    }),
    {
      name: 'game-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);