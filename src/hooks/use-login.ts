import { useCallback, useState } from "react";
import axios from "@/libs/axios";
import axiosInstance from "@/libs/axios";
import { useNearWallet } from "@/contexts/wallet/near";

export default function useLogin() {
  const [loging, setLoging] = useState(false);
  const { selector } = useNearWallet();

  const onLogin = useCallback(
    async ({
      address,
      signature,
      time,
      publicKey,
      nonce,
      onSuccess
    }: {
      address: string;
      signature: string;
      time: number;
      publicKey: string;
      nonce: string;
      onSuccess: () => void;
    }) => {
      try {
        setLoging(true);
        const res = await axios.get(
          `/api/v1/account/token?address=${address}&signature=${signature}&time=${time}&public_key=${publicKey}&nonce=${nonce}`
        );

        localStorage.setItem(
          "_AK_TOKEN_",
          JSON.stringify({
            token: res.data.data,
            address
          })
        );
        onSuccess?.();
      } catch (err) {
        console.error("Login error:", err);
      } finally {
        setLoging(false);
      }
    },
    []
  );

  const signMessage = useCallback(async (message: string) => {
    if (!selector) {
      throw new Error("Wallet selector not initialized");
    }

    try {
      const wallet = await selector.wallet();
      // Generate a random nonce as Buffer
      const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(32)));
      
      const result = await wallet.signMessage?.({
        message,
        recipient: import.meta.env.VITE_NEAR_CONTRACT_ADDRESS,
        nonce
      });
      
      if (!result) {
        throw new Error("Failed to sign message");
      }
      
      return {
        signature: result.signature,
        publicKey: result.publicKey,
        nonce: result.signature.substring(0, 32) // Use part of signature as nonce replacement
      };
    } catch (error) {
      console.error("Sign message error:", error);
      throw error;
    }
  }, [selector]);

  return {
    loging,
    onLogin,
    signMessage
  };
}