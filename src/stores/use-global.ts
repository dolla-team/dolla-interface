import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  chainId: string;
  playBgm: boolean;
  code: string;
  showUserInfo: boolean;
  isInWhitelist: boolean;
  set: (params: any) => void;
  init: () => void;
}

const initialState = {
  chainId: "",
  playBgm: true,
  code: "",
  showUserInfo: false,
  isInWhitelist: false
} as GlobalState;

export const useGlobalStore = create(
  persist<GlobalState>(
    (set) => ({
      chainId: "",
      playBgm: true,
      code: "",
      showUserInfo: false,
      isInWhitelist: false,
      set: (params) => set(() => ({ ...params })),
      init: () => set(() => initialState)
    }),
    {
      name: "_global",
      version: 0.11,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
