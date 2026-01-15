import { create } from "zustand";

interface BtcDetailState {
  bidResult: any;
  currentHash: string;
  bids: number;
  flipStatus: number; // 0: not flipping, 1: bidding, 2: bid success, 3: waiting, 4: bid complete, 5: auto flipping, 6: complete
  set: (params: any) => void;
}

const useBtcDetailStore = create<BtcDetailState>((set) => ({
  bidResult: null,
  currentHash: "",
  bids: 1,
  flipStatus: 0,
  set: (params) => set(() => ({ ...params }))
}));
export default useBtcDetailStore;
