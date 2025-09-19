import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ClickTokens {
  set: (params: any) => void;
  setTokens: (tokens: any) => void;
  tokens: any;
}

export const use1clickTokensStore = create(
  persist<ClickTokens>(
    (set) => ({
      tokens: [],
      set: (params) => set(() => ({ ...params })),
      setTokens: (tokens: any) => {
        set((state) => {
          return { ...state, tokens };
        });
      },
    }),
    {
      name: "_1click-token",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
