import { create } from "zustand/index";

interface NftsState {
  nfts: any[];
  refresher: number;
  set: (params: any) => void;
}

const useNftsStore = create<NftsState>((set) => ({
  nfts: [],
  refresher: 0,
  set: (params) => set(() => ({ ...params }))
}));

export default useNftsStore;
