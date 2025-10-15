import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AllMarketsState {
  tab: any;
  hotMarkets: Record<string, any>;
  set: (params: any) => void;
}

export const useAllMarketsStore = create(
  persist<AllMarketsState>(
    (set) => ({
      tab: 0,
      hotMarkets: {
        "0": null,
        "1": null,
        "2": null
      },
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_all_markets",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
