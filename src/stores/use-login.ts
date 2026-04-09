import { create } from 'zustand/index'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LoginState {
  isX: boolean
  wallet?: 'privy' | 'near'
  set: (params: any) => void
}

const useLoginStore = create(
  persist<LoginState>(
    set => ({
      isX: false,
      wallet: undefined,
      set: params => set(() => ({ ...params })),
    }),
    {
      name: '_login',
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useLoginStore
