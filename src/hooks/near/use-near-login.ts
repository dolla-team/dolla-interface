import { useCallback, useState } from "react";
import axios from "@/libs/axios";
import { useNearWallet } from "@/contexts/wallet/near";

export default function useNearLogin() {
  const [loging, setLoging] = useState(false);
  const { accountId } = useNearWallet();

  const onLogin = useCallback(
    async ({
      accountId,
      publicKey,
      signature,
      time,
      onSuccess
    }: {
      accountId: string;
      publicKey: string;
      signature: string;
      time: number;
      onSuccess: () => void;
    }) => {
      try {
        setLoging(true);
        const res = await axios.get(
          `/api/v1/account/token?address=${accountId}&signature=${signature}&time=${time}&public_key=${publicKey}`
        );

        localStorage.setItem(
          "_AK_TOKEN_",
          JSON.stringify({
            token: res.data.data,
            address: accountId
          })
        );
        onSuccess?.();
      } catch (err) {
        console.error("Near login error:", err);
      } finally {
        setLoging(false);
      }
    },
    []
  );

  const onLogout = useCallback(async (onSuccess?: () => void) => {
    await axios.post("/api/logout");
    onSuccess?.();
  }, []);

  return {
    loging,
    onLogin,
    onLogout
  };
}