import { useMemo } from "react";
import use1clickTokens from "@/hooks/use-1click-tokens";
import useWalletStore from "@/stores/use-wallet";
import { QUOTE_TOKEN } from "@/config/btc";

export const useChains = () => {
  const { tokens } = use1clickTokens();
  const walletStore = useWalletStore();
  return useMemo(() => {
    return tokens.filter((token: any) => {
      if (
        !token.symbol
          .toUpperCase()
          .includes(walletStore.selectedToken.symbol.toUpperCase())
      )
        return false;
      if (
        walletStore.selectedToken?.symbol === QUOTE_TOKEN.symbol &&
        ["ETH", "SOL", "BSC", "POL", "ARB"].includes(
          token.blockchain.toUpperCase()
        )
      ) {
        return true;
      }

      if (
        walletStore.selectedToken?.symbol === "ETH" &&
        ["ETH", "ARB", "OP"].includes(token.blockchain.toUpperCase())
      ) {
        return true;
      }
      if (
        walletStore.selectedToken?.symbol === "BTC" &&
        ["BTC"].includes(token.blockchain.toUpperCase())
      ) {
        return true;
      }
      return false;
    });
  }, [walletStore.selectedToken, tokens]);
};
