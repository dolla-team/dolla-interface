import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TipsState {
  step: number;
  set: (params: any) => void;
}

export const useTipsStore = create(
  persist<TipsState>(
    (set) => ({
      step: 1,
      // Move to next step
      set: (params: TipsState) => set(() => ({ ...params }))
    }),
    {
      name: "_tips",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
