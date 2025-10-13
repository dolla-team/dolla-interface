import useWalletStore from "@/stores/use-wallet";
import { quote } from "@/hooks/near/util";
import useWithdraw from "@/hooks/near/use-withdraw";
import dayjs from "dayjs";
import { NEAR_REFUND_ACCOUNT } from "@/config";
import { useState, useEffect } from "react";
import { useDebounce } from "ahooks";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import useCopy from "@/hooks/use-copy";
import CopyIcon from "@/components/icons/copy";
import { useAuth } from "@/contexts/auth";
import Button from "@/components/button";

export default function WithdrawConfirm({
  amount,
  chain,
  onSuccess,
  receiveAddress,
  amountUSD,
  balance
}: {
  amount: string;
  chain: any;
  onSuccess: () => void;
  receiveAddress: string;
  amountUSD: string;
  balance: string;
}) {
  const debouncedAmount = useDebounce(amount, { wait: 1000 });
  const walletStore = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<any>(null);
  const toast = useToast();
  const { onCopy } = useCopy();
  const { userInfo } = useAuth();

  const { withdraw, loading: withdrawing } = useWithdraw(() => {
    setQuoteData(null);
    walletStore.set({
      showWallet: false,
      withdrawPanelType: "token-selector"
    });
    onSuccess();
  });

  useEffect(() => {
    if (debouncedAmount && chain && receiveAddress) {
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
    }
  }, [debouncedAmount, chain, receiveAddress]);
  return (
    <div className="h-full relative">
      <div className="text-[16px] text-black font-[500] text-center mt-[40px] mb-[20px]">
        Withdraw
      </div>
      <div className="text-center text-[32px] font-[700]">
        <span className="text-black mr-[10px]">{amount}</span>
        <span className="text-black/50">
          {walletStore.selectedToken?.symbol}
        </span>
      </div>
      <div className="text-[14px] text-black text-center mt-[10px]">
        ${amountUSD}
      </div>
      <div className="bg-[#2F6DFF]/10 rounded-[10px] py-[8px] px-[12px] text-black text-[12px] my-[12px]">
        <div className="flex justify-between items-center">
          <span>Est. Receive</span>
          <span>
            {" "}
            {quoteData
              ? Big(quoteData.minAmountOut)
                  .div(10 ** walletStore.selectedToken?.decimals)
                  .toString()
              : "-"}{" "}
            {walletStore.selectedToken?.symbol}
          </span>
        </div>
        <div className="flex justify-between items-center mt-[8px]">
          <span>Est. arrival</span>
          <span>≈ {chain?.blockchain === "btc" ? "15" : "1"} mins</span>
        </div>
      </div>
      <div className="text-[12px] text-[#8A87AA]">Sending Address</div>
      <div className="flex gap-[3px] items-start">
        <div className="text-[14px] text-black w-[280px] break-words">
          {userInfo?.user}
        </div>
        <button
          className="button mt-[6px]"
          onClick={() => {
            onCopy(userInfo?.user);
          }}
        >
          <CopyIcon />
        </button>
      </div>

      <div className="text-[12px] text-[#8A87AA] mt-[20px]">
        Receiving Address
      </div>
      <div className="flex items-start gap-[3px]">
        <div className="text-[14px] text-black w-[280px] break-words">
          {receiveAddress}
        </div>
        <button
          className="button"
          onClick={() => {
            onCopy(receiveAddress);
          }}
        >
          <CopyIcon />
        </button>
      </div>
      <div className="absolute bottom-[50px] left-0 w-full">
        <Button
          disabled={loading || withdrawing || !quoteData}
          className="w-full h-[50px] !bg-[black] !text-white"
          loading={loading || withdrawing}
          onClick={() => {
            if (!quoteData?.depositAddress) return;
            withdraw({
              fromToken: walletStore.selectedToken,
              amount: amount,
              recipientAccount: quoteData.depositAddress,
              isMax: amount === balance
            });
          }}
        >
          Confirm
        </Button>
        <Button
          className="w-full h-[50px] !bg-white !text-black border border-[#000000]/10 mt-[10px]"
          onClick={() => {
            walletStore.set({ withdrawPanelType: "input" });
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
