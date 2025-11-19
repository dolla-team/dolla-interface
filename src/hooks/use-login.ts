import { useCallback, useState } from "react";
import axios from "@/libs/axios";
// import { usePrivy, useSessionSigners, useUser } from "@privy-io/react-auth";
// import axiosInstance from "@/libs/axios";

export default function useLogin() {
  const [loging, setLoging] = useState(false);
  // const { user } = useUser();
  // const { ready } = usePrivy();
  // const { addSessionSigners } = useSessionSigners();
  // const [accounts, setAccounts] = useState<any[]>([]);

  const onLogin = useCallback(
    async ({
      address,
      signature,
      time,
      solAddress,
      userId,
      chainType,
      onSuccess
    }: {
      address: string;
      signature: string;
      time: number;
      solAddress: string;
      userId: string;
      chainType: string;
      onSuccess: () => void;
    }) => {
      try {
        setLoging(true);

        const params: any = {
          address,
          signature,
          time,
          privy_wallet_id: userId
        };
        if (solAddress && chainType === "") {
          params.sol_address = solAddress;
        }
        if (chainType) {
          params.type = chainType;
        }
        const res = await axios.get(`/api/v1/account/token`, {
          params
        });

        localStorage.setItem(
          "_AK_TOKEN_",
          JSON.stringify({
            token: res.data.data,
            address
          })
        );
        onSuccess?.();
        // const users = await axiosInstance.get("/api/v1/privy/user");
        // const linkedAccounts = users?.data?.data?.linked_accounts;
        // setAccounts(
        //   linkedAccounts
        //     ?.filter(
        //       (item: any) =>
        //         item.wallet_client_type === "privy" && !item.delegated
        //     )
        //     .map((item: any) => item.address)
        // );
      } catch (err) {
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

  // useEffect(() => {
  //   if (user && ready && accounts.length > 0) {
  //     setTimeout(() => {
  //       accounts.forEach((account) => {
  //         addSessionSigners({
  //           address: account,
  //           signers: [
  //             {
  //               signerId: import.meta.env.VITE_PRIVY_SIGNER_ID
  //             }
  //           ]
  //         });
  //       });
  //     }, 30);
  //   }
  // }, [user, ready, accounts]);

  return {
    loging,
    onLogin,
    onLogout
  };
}
