import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppState {
  dark: boolean;
  rtl: boolean;
  onboardingComplete: boolean;
  currentTab: string;
  streak: number;
  xp: number;
  level: string;
  userName: string;
  goalId: string | null;
  levelId: string | null;

  toggleDark: () => void;
  toggleRtl: () => void;
  completeOnboarding: () => void;
  setTab: (tab: string) => void;
  setGoal: (id: string) => void;
  setLevel: (id: string) => void;
  setStreak: (streak: number) => void;
  setXp: (xp: number) => void;
  addXp: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      dark: false,
      rtl: false,
      onboardingComplete: false,
      currentTab: 'home',
      streak: 14,
      xp: 2140,
      level: 'B1',
      userName: 'Sara',
      goalId: null,
      levelId: null,

      toggleDark: () => set((s) => ({ dark: !s.dark })),
      toggleRtl: () => set((s) => ({ rtl: !s.rtl })),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setTab: (tab) => set({ currentTab: tab }),
      setGoal: (id) => set({ goalId: id }),
      setLevel: (id) => set({ levelId: id }),
      setStreak: (streak) => set({ streak }),
      setXp: (xp) => set({ xp }),
      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
    }),
    {
      name: 'tara-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
