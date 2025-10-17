import { create } from "zustand";

interface LuckyDrawState {
  showHistory: boolean;
  historyRound: number;
  set: (params: any) => void;
}

const useLuckyDrawStore = create<LuckyDrawState>((set) => ({
  showHistory: false,
  historyRound: 0,
  set: (params) => set(() => ({ ...params }))
}));

export default useLuckyDrawStore;
