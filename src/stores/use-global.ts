import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  chainId: string;
  set: (params: any) => void;
}

export const useGlobal = create(
  persist<GlobalState>(
    (set) => ({
      chainId: "",
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_global",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
