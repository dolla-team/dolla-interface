import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AllMarketsState {
  tab: any;
  status: any;
  pools: Record<number, any>;
  set: (params: any) => void;
}

export const useAllMarketsStore = create(
  persist<AllMarketsState>(
    (set) => ({
      tab: 0,
      status: "1",
      pools: {},
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_all_markets",
      version: 0.12,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
