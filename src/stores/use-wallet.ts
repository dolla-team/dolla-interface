import { create } from "zustand/index";
import { createJSONStorage, persist } from "zustand/middleware";

interface WalletState {
  showWallet: boolean;
  showInfos: boolean;
  panelType: "info" | "deposit" | "withdraw" | "swap";
  depositPanelType: "fund-list" | "token-selector" | "input";
  depositMethod: "centralized-exchange" | "coinbase";
  withdrawPanelType: "token-selector" | "input";
  withdrawType: "token" | "nft";
  selectedToken: any;
  defaultDepositAmount: any;
  set: (params: any) => void;
  get: () => WalletState;
  init: () => void;
}

const initialState = {
  showWallet: false,
  showInfos: false,
  panelType: "info",
  depositPanelType: "fund-list",
  depositMethod: "centralized-exchange",
  withdrawPanelType: "token-selector",
  withdrawType: "token",
  selectedToken: null,
  defaultDepositAmount: null
} as WalletState;

const useWalletStore = create(
  persist<WalletState>(
    (set, get) => ({
      ...initialState,
      set: (params) => set(() => ({ ...params })),
      get: () => get(),
      init: () => set(() => initialState)
    }),
    {
      name: "_wallet",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useWalletStore;
