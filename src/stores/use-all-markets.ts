import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AllMarketsState {
  tab: any;
  status: any;
  set: (params: any) => void;
}

export const useAllMarketsStore = create(
  persist<AllMarketsState>(
    (set) => ({
      tab: 0,
      status: "1",
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_all_markets",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
