import { create } from "zustand/index";

interface BtcState {
  recommendValue: string;
  set: (params: any) => void;
  get: () => BtcState;
}

const useBtcStore = create<BtcState>((set, get) => ({
  recommendValue: "",
  set: (params) => set(() => ({ ...params })),
  get: () => get()
}));

export default useBtcStore;
