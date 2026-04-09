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
      twitterId,
      publicKey,
      nonce,
      onSuccess,
    }: {
      address: string
      signature: string
      time: number
      solAddress?: string
      userId: string
      chainType: string
      twitterId?: string | null
      publicKey?: string
      nonce?: string
      onSuccess: () => void
    }) => {
      try {
        console.log('logining')
        setLoging(true)

        const params: any = {
          address,
          signature,
          time,
        }
        if (solAddress) {
          params.sol_address = solAddress
        }
        if (chainType) {
          params.type = chainType
        }
        if (twitterId) {
          params.twitter_id = '@' + twitterId
          params.type = 'privy_twitter'
        }
        if (chainType !== 'near') {
          params.privy_wallet_id = userId
        }
        if (chainType === 'near') {
          params.address = address
          params.public_key = publicKey
          params.recipient = 'dolla.market'
          if (nonce) {
            params.nonce = nonce
          }
        }
        const res = await axios.get(`/api/v1/account/token`, {
          params,
        })

        localStorage.setItem(
          '_AK_TOKEN_',
          JSON.stringify({
            token: res.data.data,
            address,
          })
        )
        onSuccess?.()
      } catch (err) {
      } finally {
        setLoging(false)
      }
    },
    []
  )

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
