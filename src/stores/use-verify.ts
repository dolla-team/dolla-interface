import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface VerifyState {
  hasAccount: boolean
  isBgSpread: boolean
  followed: boolean
  followClicked: boolean
  retweeted: boolean
  retweetClicked: boolean
  set: (params: any) => void
  init: () => void
}

const initialState = {
  hasAccount: false,
  isBgSpread: false,
  followed: false,
  followClicked: false,
  retweeted: false,
  retweetClicked: false,
} as VerifyState

export const useVerifyStore = create(
  persist<VerifyState>(
    set => ({
      hasAccount: false,
      isBgSpread: false,
      followed: false,
      followClicked: false,
      retweeted: false,
      retweetClicked: false,
      set: params => set(() => ({ ...params })),
      init: () => set(() => initialState),
    }),
    {
      name: '_verify',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
