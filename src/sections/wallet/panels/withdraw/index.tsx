import WithdrawNft from "./withdraw-nft";
import useWalletStore from "@/stores/use-wallet";
import TokenSelector from "../deposit/token-selector";
import WithdrawInput from "./input";
import { useState, useMemo } from "react";
import ChainSelector from "./chain-selector";
import WithdrawConfirm from "./withdraw-confirm";
import { useAuth } from "@/contexts/auth";
import useTokenPrice from "@/hooks/use-token-price";
import Big from "big.js";
import { formatNumber } from "@/utils/format/number";

export default function WithdrawPanel({ onBack }: { onBack: () => void }) {
  const walletStore = useWalletStore();
  const [chain, setChain] = useState<any>(null);
  const [receiveAddress, setReceiveAddress] = useState<string>("");
  const [amount, setAmount] = useState("");
  const { nearAccount } = useAuth();
  const balance = walletStore.selectedToken?.isBaseToken
    ? nearAccount?.prizeBalance
    : nearAccount?.balance;
  const tokenIds = useMemo(() => {
    return [
      {
        chain: "near",
        address: walletStore?.selectedToken?.address
      }
    ];
  }, [walletStore?.selectedToken]);
  const { prices } = useTokenPrice(tokenIds);
  const tokenPrice = prices?.[0]?.last_price;

  const amountUSD = useMemo(() => {
    const _amountUSD = Big(amount || 0).mul(tokenPrice || 0);
    return _amountUSD ? formatNumber(_amountUSD, 2, true) : "-";
  }, [amount, tokenPrice]);

  return (
    <div className="px-[16px] pt-[16px] h-full">
      {walletStore.withdrawPanelType === "token-selector" && (
        <TokenSelector
          onBack={onBack}
          onSelect={(token: any) => {
            walletStore.set({
              selectedToken: token,
              withdrawPanelType: "chain-selector"
            });
          }}
          title="Withdraw"
        />
      )}
      {walletStore.withdrawPanelType === "chain-selector" && (
        <ChainSelector
          selectedChain={chain}
          onSelect={(chain: any) => {
            setChain(chain);
          }}
          receiveAddress={receiveAddress}
          setReceiveAddress={setReceiveAddress}
        />
      )}
      {walletStore.withdrawPanelType === "input" && (
        <WithdrawInput
          chain={chain}
          balance={balance}
          amount={amount}
          setAmount={setAmount}
          amountUSD={amountUSD}
        />
      )}
      {walletStore.withdrawPanelType === "withdraw-confirm" && (
        <WithdrawConfirm
          amount={amount}
          amountUSD={amountUSD}
          chain={chain}
          receiveAddress={receiveAddress}
          onSuccess={() => {
            setReceiveAddress("");
            setAmount("");
          }}
          balance={balance}
        />
      )}
      {walletStore.withdrawType === "nft" && <WithdrawNft />}
    </div>
  );
}
