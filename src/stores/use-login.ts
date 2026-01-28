import { create } from 'zustand/index'

interface LoginState {
  isX: boolean
  set: (params: any) => void
}

const useLoginStore = create<LoginState>(set => ({
  isX: false,
  set: params => set(() => ({ ...params })),
}))

export default useLoginStore
