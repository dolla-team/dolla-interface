import { create } from "zustand/index";

interface WalletState {
  showWallet: boolean;
  panelType: "info" | "deposit" | "withdraw";
  withdrawType: "token" | "nft";
  set: (params: any) => void;
}

const useWalletStore = create<WalletState>((set) => ({
  showWallet: false,
  panelType: "info",
  withdrawType: "token",
  set: (params) => set(() => ({ ...params }))
}));

export default useWalletStore;
