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

      let quoteBalance = Big(0);
      let prizeBalance = Big(0);

      if (res?.ft_tokens) {
        quoteBalance = Big(
          res.ft_tokens[`{"FT":"${QUOTE_TOKEN.address}"}`] || "0"
        );
        prizeBalance = Big(
          res.ft_tokens[`{"FT":"${BASE_TOKEN.address}"}`] || "0"
        );
      }

      if (res?.gift_tokens) {
        quoteBalance = quoteBalance.add(
          Big(res.gift_tokens[`{"FT":"${QUOTE_TOKEN.address}"}`] || "0")
        );
        prizeBalance = prizeBalance.add(
          Big(res.gift_tokens[`{"FT":"${BASE_TOKEN.address}"}`] || "0")
        );
      }
      /**
        acc_bet_amount: "0",
        acc_bet_games: 0,
        acc_bets: 0,
        balance: "2999994",
        gift_balance: "0",
        nonce: 0,
       */

      const _quoteBalance = Big(quoteBalance)
        .div(10 ** QUOTE_TOKEN.decimals)
        .toString();
      const _prizeBalance = Big(prizeBalance)
        .div(10 ** BASE_TOKEN.decimals)
        .toString();

      setAccount({
        ...(res || {}),
        balance: _quoteBalance,
        prizeBalance: _prizeBalance
      });

      window.accountTimer = setTimeout(fetchAccount, 10000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!evmAddress) {
      setAccount(null);
      return;
    }
    fetchAccount();

    return () => {
      if (window.accountTimer) {
        clearTimeout(window.accountTimer);
      }
    };
  }, [evmAddress]);

  return {
    account,
    fetchAccount
  };
}
