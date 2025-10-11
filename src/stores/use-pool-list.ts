import { create } from "zustand/index";

interface PoolListState {
  hotMarkets: Record<string, any>;
  set: (params: any) => void;
}

const usePoolListStore = create<PoolListState>((set) => ({
  hotMarkets: {
    "1": null,
    "0.1": null,
    "0.01": null
  },
  set: (params) => set(() => ({ ...params }))
}));

export default usePoolListStore;
