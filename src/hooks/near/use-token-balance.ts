import { useEffect, useState } from "react";
import { useNearWallet } from "@/contexts/wallet/near";
import {
  getUserBetTokenBalance,
  getUserPrizeTokenBalance
} from "@/utils/near-game-actions";

export default function useTokenBalance({ token }: { token: any }) {
  const [tokenBalance, setTokenBalance] = useState("0");
  const { accountId } = useNearWallet();
  const [loading, setLoading] = useState(false);

  const update = async () => {
    if (!accountId) {
      setTokenBalance("0");
      return;
    }

    setLoading(true);
    try {
      // Query real token balance from NEAR contract
      let balance = "0";

      if (token?.type === "bet") {
        // Query bet token balance (USDC)
        balance = await getUserBetTokenBalance(accountId);
      } else if (token?.type === "prize") {
        // Query prize token balance (WBTC)
        balance = await getUserPrizeTokenBalance(accountId);
      } else {
        // Default to bet token balance
        balance = await getUserBetTokenBalance(accountId);
      }

      setTokenBalance(balance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setTokenBalance("0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    update();
  }, [accountId, token]);

  return {
    tokenBalance,
    update,
    loading
  };
}
