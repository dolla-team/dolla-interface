import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NearKeyState {
  set: (params: any) => void;
  publicKey: any;
  privateKey: any;
}

export const useNearKeyStore = create(
  persist<NearKeyState>(
    (set) => ({
      publicKey: null,
      privateKey: null,
      set: (params) => set(() => ({ ...params }))
    }),
    {
      name: "_near-key",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
