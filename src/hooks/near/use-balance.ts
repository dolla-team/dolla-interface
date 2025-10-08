import useTokenPrice from "@/hooks/use-token-price";
import { useMemo } from "react";
import { QUOTE_TOKEN, BASE_TOKEN } from "@/config/btc";
import { useAuth } from "@/contexts/auth";

export default function useBalance() {
  const { nearAccount } = useAuth();
  const tokenIds = useMemo(() => {
    return [
      {
        chain: "near",
        address: QUOTE_TOKEN?.address
      },
      {
        chain: "near",
        address: BASE_TOKEN?.address
      }
    ];
  }, [QUOTE_TOKEN, BASE_TOKEN]);

  const { prices } = useTokenPrice(tokenIds);

  const balance = useMemo(() => {
    return (
      prices[0]?.last_price * nearAccount?.balance +
      prices[1]?.last_price * nearAccount?.prizeBalance
    );
  }, [prices, nearAccount?.balance, nearAccount?.prizeBalance]);

  return { balance };
}
