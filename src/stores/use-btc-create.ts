import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AMOUNT } from "@/config/btc";

interface BtcCreateState {
  amount: number;
  set: (params: any) => void;
}

export const useBtcCreateStore = create(
  persist<BtcCreateState>(
    (set) => ({
      amount: AMOUNT[1],
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_btc_create",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
