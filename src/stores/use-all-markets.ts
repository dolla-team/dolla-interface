import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AllMarketsState {
  tab: string;
  status: any;
  pools: Record<number, any>;
  set: (params: any) => void;
}

export const useAllMarketsStore = create(
  persist<AllMarketsState>(
    (set) => ({
      tab: "all",
      status: "1",
      pools: {},
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_all_markets",
      version: 0.11,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
