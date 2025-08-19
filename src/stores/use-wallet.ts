import { create } from "zustand/index";

interface WalletState {
  showWallet: boolean;
  set: (params: any) => void;
}

const useWalletStore = create<WalletState>((set) => ({
  showWallet: false,
  set: (params) => set(() => ({ ...params }))
}));

export default useWalletStore;
