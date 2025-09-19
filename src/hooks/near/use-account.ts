import { useEffect, useState } from "react";
import { viewMethod } from "./util";
import Big from "big.js";

export default function useAccount(evmAddress: string) {
  const [account, setAccount] = useState<any | null>(null);

  console.log("evmAddress", evmAddress);
  const fetchAccount = async () => {
    try {
      const res = await viewMethod({
        method: "get_account",
        args: { user_id: { Evm: evmAddress.replace(/^0x/, "").toLowerCase() } }
      });
      console.log("account", res);
      /**
        acc_bet_amount: "0",
        acc_bet_games: 0,
        acc_bets: 0,
        balance: "2999994",
        gift_balance: "0",
        nonce: 0,
       */

      setAccount({
        ...(res || {}),
        balance: Big(res?.balance).div(1e6).toString()
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!evmAddress) return;
    fetchAccount();
  }, [evmAddress]);

  return {
    account,
    fetchAccount
  };
}
