import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameState {
  initialized: boolean;
  initGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      initialized: false,
      
      initGame: () => {
        set({ initialized: true });
      },
    }),
    {
      name: "game-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);