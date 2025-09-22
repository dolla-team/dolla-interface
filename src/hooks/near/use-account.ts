import { useEffect, useState } from "react";
import { viewMethod } from "./util";
import Big from "big.js";
import { QUOTE_TOKEN, BASE_TOKEN } from "@/config/btc";

export default function useAccount(evmAddress: string) {
  const [account, setAccount] = useState<any | null>();

  const fetchAccount = async () => {
    try {
      const res = await viewMethod({
        method: "get_account",
        args: { user_id: { Evm: evmAddress.replace(/^0x/, "").toLowerCase() } }
      });
      console.log("account", res);

      let quoteBalance = "0";
      let prizeBalance = "0";

      if (res?.ft_tokens) {
        quoteBalance = res.ft_tokens[`{"FT":"${QUOTE_TOKEN.address}"}`];
        prizeBalance = res.ft_tokens[`{"FT":"${BASE_TOKEN.address}"}`];
      }
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
        balance: Big(quoteBalance)
          .div(10 ** QUOTE_TOKEN.decimals)
          .toString(),
        prizeBalance: Big(prizeBalance)
          .div(10 ** BASE_TOKEN.decimals)
          .toString()
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
