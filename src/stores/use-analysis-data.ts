import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AnalysisDataState {
  status: string
  result: any
  reward: number
  handle: string
  xCode: string
  set: (params: any) => void
  init: () => void
}

const initialState = {
  status: 'input',
  result: {},
  reward: 0,
  handle: '',
  xCode: '',
} as AnalysisDataState

export const useAnalysisDataStore = create(
  persist<AnalysisDataState>(
    set => ({
      status: 'input',
      result: {},
      reward: 0,
      handle: '',
      xCode: '',
      set: params => set(() => ({ ...params })),
      init: () => set(() => initialState),
    }),
    {
      name: '_analysis_data',
      version: 0.11,
      storage: createJSONStorage(() => localStorage),
    }
  )
)
