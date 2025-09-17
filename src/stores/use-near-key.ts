import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NearKeyState {    
    set: (params: any) => void;
    setPublicKey: (publicKey: any) => void;
    setPrivateKey: (privateKey: any) => void;
    publicKey: any;
    privateKey: any;
}

export const useNearKeyStore = create(
    persist<NearKeyState>(
        (set) => ({
            publicKey: null,
            privateKey: null,
            set: (params) => set(() => ({ ...params })),
            setPublicKey: (publicKey: any) => {
                set((state) => {
                    return { ...state, publicKey };
                })
            },
            setPrivateKey: (privateKey: any) => {
                set((state) => {
                    return { ...state, privateKey };
                })
            },
        }),
        {
            name: "_near-key",
            version: 0.1,
            storage: createJSONStorage(() => localStorage)
        }
    )
);
