import { create } from 'zustand/index'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LoginState {
  isX: boolean
  wallet?: 'privy' | 'near'
  showWalletsModal: boolean
  set: (params: any) => void
  init: () => void
}

const initialState = {
  isX: false,
  wallet: undefined,
  showWalletsModal: false,
} as LoginState

const useLoginStore = create(
  persist<LoginState>(
    set => ({
      isX: false,
      wallet: undefined,
      showWalletsModal: false,
      set: params => set(() => ({ ...params })),
      init: () => set(() => initialState),
    }),
    {
      name: '_login',
      version: 0.11,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useLoginStore
