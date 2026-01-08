import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Answer, MBTIDimension, MBTIType } from '../types';

interface TestState {
  currentQuestion: number;
  answers: Answer[];
  result: MBTIType | null;
  isCompleted: boolean;

  setCurrentQuestion: (index: number) => void;
  addAnswer: (answer: Answer) => void;
  updateAnswer: (questionId: number, answer: Answer) => void;
  calculateResult: () => MBTIType;
  reset: () => void;
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      answers: [],
      result: null,
      isCompleted: false,

      setCurrentQuestion: (index) => set({ currentQuestion: index }),

      addAnswer: (answer) =>
        set((state) => ({
          answers: [...state.answers, answer],
          currentQuestion: state.currentQuestion + 1,
        })),

      updateAnswer: (questionId, answer) =>
        set((state) => ({
          answers: state.answers.map((a) =>
            a.questionId === questionId ? answer : a
          ),
        })),

      calculateResult: () => {
        const { answers } = get();

        const counts: Record<MBTIDimension, number> = {
          E: 0, I: 0,
          S: 0, N: 0,
          T: 0, F: 0,
          J: 0, P: 0,
        };

        answers.forEach((answer) => {
          counts[answer.dimension]++;
        });

        const result = [
          counts.E >= counts.I ? 'E' : 'I',
          counts.S >= counts.N ? 'S' : 'N',
          counts.T >= counts.F ? 'T' : 'F',
          counts.J >= counts.P ? 'J' : 'P',
        ].join('') as MBTIType;

        set({ result, isCompleted: true });
        return result;
      },

      reset: () =>
        set({
          currentQuestion: 0,
          answers: [],
          result: null,
          isCompleted: false,
        }),
    }),
    {
      name: 'mbti-test-storage',
    }
  )
);
