import { create } from "zustand/index";

interface PoolListState {
  hotMarkets: Record<string, any>;
  set: (params: any) => void;
}

const usePoolListStore = create<PoolListState>((set) => ({
  hotMarkets: {
    "0": null,
    "1": null,
    "2": null
  },
  set: (params) => set(() => ({ ...params }))
}));

export default usePoolListStore;
