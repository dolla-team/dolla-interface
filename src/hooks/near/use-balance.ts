import useTokenPrice from "@/hooks/use-token-price";
import { useMemo } from "react";
import { QUOTE_TOKEN, BASE_TOKEN } from "@/config/btc";
import { useAuth } from '@/contexts/wallet'
import useLoginStore from '@/stores/use-login'

export default function useBalance() {
  const { nearAccount } = useAuth();
  const wallet = useLoginStore(s => s.wallet)

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
    let _balance = 0
    if (wallet === 'near') {
      _balance = prices[0]?.last_price * Number(nearAccount?.onlyQuoteBalance ?? 0)
    }
    _balance = _balance + prices[0]?.last_price * nearAccount?.balance
    return _balance + prices[1]?.last_price * (nearAccount?.prizeBalance || 0)
  }, [
    wallet,
    nearAccount?.onlyQuoteBalance,
    prices,
    nearAccount?.balance,
    nearAccount?.prizeBalance,
  ])
  
  return { balance };
}
