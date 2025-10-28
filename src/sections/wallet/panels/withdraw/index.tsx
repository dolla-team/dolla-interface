import WithdrawNft from "./withdraw-nft";
import useWalletStore from "@/stores/use-wallet";
import TokenSelector from "../deposit/token-selector";
import WithdrawInput from "./input";
import { useState, useMemo } from "react";
import WithdrawConfirm from "./withdraw-confirm";
import { useAuth } from "@/contexts/auth";
import useTokenPrice from "@/hooks/use-token-price";
import Big from "big.js";
import { formatNumber } from "@/utils/format/number";
import { quote } from "@/hooks/near/util";
import useWithdraw from "@/hooks/near/use-withdraw";
import { useEffect } from "react";
import { useDebounce } from "ahooks";
import useToast from "@/hooks/use-toast";
import { NEAR_REFUND_ACCOUNT } from "@/config";
import dayjs from "dayjs";
import { isValidAddress } from "@/utils/validate-address";

export default function WithdrawPanel({ onBack }: { onBack: () => void }) {
  const walletStore = useWalletStore();
  const [chain, setChain] = useState<any>(null);
  const [receiveAddress, setReceiveAddress] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const { nearAccount } = useAuth();
  const toast = useToast();
  const debouncedAmount = useDebounce(amount, { wait: 1000 });
  const balance = walletStore.selectedToken?.isBaseToken
    ? nearAccount?.prizeBalance
    : nearAccount?.onlyQuoteBalance;
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

  const { withdraw, loading: withdrawing } = useWithdraw(() => {
    setQuoteData(null);
    walletStore.set({
      showWallet: false,
      withdrawPanelType: "token-selector"
    });
    setReceiveAddress("");
    setAmount("");
  });

  const networkFee = useMemo(() => {
    const _fee = Big(quoteData?.amountInFormatted || 0).minus(
      quoteData?.amountOutFormatted || 0
    );
    return _fee.toString();
  }, [quoteData]);

  useEffect(() => {
    if (
      debouncedAmount &&
      chain &&
      receiveAddress &&
      isValidAddress(receiveAddress, chain.blockchain)
    ) {
      (async () => {
        try {
          setQuoteData(null);
          setLoading(true);
          const _amount = Big(amount)
            .mul(10 ** walletStore.selectedToken?.decimals)
            .toFixed(0);
          const res = await quote({
            dry: false,
            swapType: "EXACT_INPUT",
            slippageTolerance: 50,
            originAsset: walletStore.selectedToken?.assetId,
            depositType: "ORIGIN_CHAIN",
            destinationAsset: chain.assetId,
            amount: _amount,
            refundTo: NEAR_REFUND_ACCOUNT,
            refundType: "ORIGIN_CHAIN",
            recipient: receiveAddress,
            recipientType: "DESTINATION_CHAIN",
            deadline: dayjs().add(1, "hour").toISOString()
          });
          setQuoteData(res.quote);
          setLoading(false);
        } catch (error: any) {
          setLoading(false);
          toast.info({
            title: error.message
          });
        }
      })();
    } else {
      setQuoteData(null);
    }
  }, [debouncedAmount, chain, receiveAddress]);

  return (
    <div className="pt-[16px] h-full">
      {walletStore.withdrawPanelType === "token-selector" && (
        <TokenSelector
          onBack={onBack}
          onSelect={(token: any) => {
            walletStore.set({
              selectedToken: token,
              withdrawPanelType: "input"
            });
          }}
          title="Withdraw"
          className="px-[16px]"
        />
      )}
      {walletStore.withdrawPanelType === "input" && (
        <WithdrawInput
          chain={chain}
          balance={balance}
          setChain={setChain}
          receiveAddress={receiveAddress}
          setReceiveAddress={setReceiveAddress}
          amount={amount}
          setAmount={setAmount}
          amountUSD={amountUSD}
          quoteData={quoteData}
          loading={loading}
          networkFee={networkFee}
        />
      )}
      {walletStore.withdrawPanelType === "withdraw-confirm" && (
        <WithdrawConfirm
          amount={amount}
          amountUSD={amountUSD}
          chain={chain}
          receiveAddress={receiveAddress}
          balance={balance}
          withdraw={withdraw}
          withdrawing={withdrawing}
          networkFee={networkFee}
          quoteData={quoteData}
        />
      )}
      {walletStore.withdrawType === "nft" && <WithdrawNft />}
    </div>
  );
}
