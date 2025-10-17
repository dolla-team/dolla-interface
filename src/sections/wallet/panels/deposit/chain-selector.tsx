import { useMemo } from "react";
import use1clickTokens from "@/hooks/use-1click-tokens";
import useWalletStore from "@/stores/use-wallet";
import clsx from "clsx";
import { chainConfig } from "../../chain-config";
import { QUOTE_TOKEN } from "@/config/btc";

export default function ChainSelector({
  selectedChain,
  onSelect,
  className
}: any) {
  const { tokens } = use1clickTokens();
  const walletStore = useWalletStore();
  const usedChains = useMemo(() => {
    return tokens.filter((token: any) => {
      if (
        !token.symbol
          .toUpperCase()
          .includes(walletStore.selectedToken.symbol.toUpperCase())
      )
        return false;
      if (
        walletStore.selectedToken?.symbol === QUOTE_TOKEN.symbol &&
        ["ETH", "SOL", "BSC", "POL"].includes(token.blockchain.toUpperCase())
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

  return (
    <div>
      <div
        className={clsx("flex flex-col gap-[8px] overflow-y-auto", className)}
      >
        {usedChains.map((network) => (
          <div
            key={network.blockchain}
            onClick={() => {
              onSelect({
                ...network,
                name:
                  chainConfig[network?.blockchain]?.name || network.blockchain
              });
            }}
            className={clsx(
              "flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] cursor-pointer transition-colors",
              selectedChain?.blockchain === network.blockchain
                ? "bg-[#F3F4F6]"
                : "hover:bg-black/5"
            )}
          >
            <div className="w-[32px] h-[32px] flex items-center justify-center">
              <img
                src={chainConfig[network?.blockchain]?.icon}
                alt={
                  chainConfig[network?.blockchain]?.name || network.blockchain
                }
                className="w-full h-full object-cover rounded-[6px]"
              />
            </div>
            <div className="text-[16px] font-[400] text-black">
              {chainConfig[network?.blockchain]?.name || network.blockchain}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
