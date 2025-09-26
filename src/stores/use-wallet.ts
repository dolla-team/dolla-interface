import { create } from "zustand/index";

interface WalletState {
  showWallet: boolean;
  showUserInfo: boolean;
  showInfos: boolean;
  panelType: "info" | "deposit" | "withdraw" | "swap";
  withdrawType: "token" | "nft";
  defaultDepositToken: any;
  defaultDepositAmount: any;
  set: (params: any) => void;
  get: () => WalletState;
}

const useWalletStore = create<WalletState>((set, get) => ({
  showWallet: false,
  showUserInfo: true,
  showInfos: false,
  panelType: "info",
  withdrawType: "token",
  defaultDepositToken: null,
  defaultDepositAmount: null,
  set: (params) => set(() => ({ ...params })),
  get: () => get()
}));

export default useWalletStore;
