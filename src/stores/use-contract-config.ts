import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ContractConfigState {
  config: any;
  set: (params: any) => void;
}

export const useContractConfigStore = create(
  persist<ContractConfigState>(
    (set) => ({
      config: {
        cancel_penalty_rate: 0.08
      },
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_contract_config",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
