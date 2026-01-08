import { create } from 'zustand';
import { MBTIType, Statistics } from '../types';

const STORAGE_KEY = 'mbti-stats';

const getInitialStats = (): Statistics => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const allTypes: MBTIType[] = [
    'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
    'ISTP', 'ISFP', 'INFP', 'INTP',
    'ESTP', 'ESFP', 'ENFP', 'ENTP',
    'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
  ];

  const distribution = allTypes.reduce((acc, type) => {
    acc[type] = Math.floor(Math.random() * 500) + 100;
    return acc;
  }, {} as Record<MBTIType, number>);

  const totalCount = Object.values(distribution).reduce((a, b) => a + b, 0);

  return { totalCount, distribution };
};

interface StatsState {
  stats: Statistics;
  incrementType: (type: MBTIType) => void;
  getPercentage: (type: MBTIType) => number;
  getRank: (type: MBTIType) => number;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: getInitialStats(),

  incrementType: (type) =>
    set((state) => {
      const newStats = {
        totalCount: state.stats.totalCount + 1,
        distribution: {
          ...state.stats.distribution,
          [type]: state.stats.distribution[type] + 1,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      return { stats: newStats };
    }),

  getPercentage: (type) => {
    const { stats } = get();
    return Number(((stats.distribution[type] / stats.totalCount) * 100).toFixed(1));
  },

  getRank: (type) => {
    const { stats } = get();
    const sorted = Object.entries(stats.distribution)
      .sort(([, a], [, b]) => b - a)
      .map(([t]) => t);
    return sorted.indexOf(type) + 1;
  },
}));
