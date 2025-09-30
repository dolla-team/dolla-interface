import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  chainId: string;
  playBgm: boolean;
  code: string;
  set: (params: any) => void;
}

export const useGlobalStore = create(
  persist<GlobalState>(
    (set) => ({
      chainId: "",
      playBgm: true,
      code: "",
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_global",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
