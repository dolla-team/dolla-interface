import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GlobalState {
  chainId: string
  playBgm: boolean
  code: string
  showUserInfo: boolean
  isInWhitelist: boolean
  loginMethod: string
  address: string
  set: (params: any) => void
  init: () => void
}

const initialState = {
  chainId: "",
  playBgm: true,
  code: "",
  showUserInfo: false,
  isInWhitelist: false,
  loginMethod: "",
} as GlobalState;

export const useGlobalStore = create(
  persist<GlobalState>(
    set => ({
      chainId: '',
      playBgm: true,
      code: '',
      showUserInfo: false,
      isInWhitelist: false,
      loginMethod: '',
      address: '',
      set: params => set(() => ({ ...params })),
      init: () => set(() => initialState),
    }),
    {
      name: '_global',
      version: 0.11,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
