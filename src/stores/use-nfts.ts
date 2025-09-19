import { create } from "zustand/index";

interface NftsState {
  nfts: any[];
  refresher: number;
  loading: boolean;
  set: (params: any) => void;
}

const useNftsStore = create<NftsState>((set) => ({
  nfts: [],
  refresher: 0,
  loading: false,
  set: (params) => set(() => ({ ...params }))
}));

export default useNftsStore;
