import { create } from "zustand/index";

interface PoolListState {
  hasMarkets: Record<string, boolean>;
  set: (params: any) => void;
}

const usePoolListStore = create<PoolListState>((set) => ({
  hasMarkets: {
    "1": false,
    "0.1": false,
    "0.01": false
  },
  set: (params) => set(() => ({ ...params }))
}));

export default usePoolListStore;
