import useWalletStore from "@/stores/use-wallet";
import Button from "@/components/button";
import BackIcon from "../../back-icon";
import { chainConfig } from "../../chain-config";
import { formatNumber } from "@/utils/format/number";
import WarningIcon from "../deposit/warning-icon";

export default function WithdrawConfirm({
  amount,
  chain,
  receiveAddress,
  amountUSD,
  balance,
  withdraw,
  withdrawing,
  networkFee,
  quoteData
}: any) {
  const walletStore = useWalletStore();

  return (
    <div className="h-full relative">
      <div
        className="flex items-center gap-[8px] text-[16px] cursor-pointer button px-[16px]"
        onClick={() => {
          walletStore.set({ withdrawPanelType: "input" });
        }}
      >
        <BackIcon />
        <div className="text-black text-[14px]">Confirm Order</div>
      </div>
      <div className="text-[12px] text-[#8A87AA] text-center mt-[40px] mb-[8px]">
        You’ll receive
      </div>
      <div className="text-center text-[32px] font-[700] truncate text-black">
        <span className="mr-[4px]">
          {formatNumber(
            quoteData?.amountOutFormatted || 0,
            walletStore.selectedToken?.isBaseToken ? 6 : 2,
            true
          )}{" "}
        </span>
        <span className="text-[14px] font-[400]">
          {walletStore.selectedToken?.symbol}
        </span>
      </div>
      <div className="text-[12px] text-[#8A87AA] text-center mt-[10px]">
        ${formatNumber(quoteData?.amountOutUsd || 0, 2, true)}
      </div>
      <div className="border-t border-[#D9D9D9] mt-[20px] px-[16px]">
        <div className="flex items-center justify-between py-[12px]">
          <div className="text-[12px] text-[#8A87AA]">Network</div>
          <div className="text-[12px] text-[#000]">
            {chainConfig[chain?.blockchain]?.name || chain?.blockchain}
          </div>
        </div>
        <div className="flex items-center justify-between py-[12px]">
          <div className="text-[12px] text-[#8A87AA]">Address</div>
          <div className="text-[12px] text-[#000] w-[206px] break-all text-right">
            {receiveAddress}
          </div>
        </div>
        <div className="flex items-center justify-between py-[12px]">
          <div className="text-[12px] text-[#8A87AA]">Amount</div>
          <div className="text-[12px] text-[#000]">
            {amount} {walletStore.selectedToken?.symbol}
          </div>
        </div>
        <div className="flex items-center justify-between py-[12px]">
          <div className="text-[12px] text-[#8A87AA]">Network fee</div>
          <div className="text-[12px] text-[#000]">
            {formatNumber(
              networkFee || 0,
              walletStore.selectedToken?.isBaseToken ? 6 : 2,
              true
            )}{" "}
            {walletStore.selectedToken?.symbol}
          </div>
        </div>
      </div>

      <div className="absolute bottom-[20px] left-0 w-full px-[16px]">
        <div className="w-full mt-[6px] py-[10px] px-[6px] text-[12px] flex gap-[8px] leading-[14px] text-black font-[300] bg-[#FFC42F]/10 rounded-[12px]">
          <WarningIcon />
          <div>
            Ensure this address supports{" "}
            {chainConfig[chain?.blockchain]?.name || chain?.blockchain} network
            deposits. Sending to another network may result in loss of funds.
          </div>
        </div>
        <Button
          disabled={withdrawing}
          className="w-full h-[50px] !bg-[black] !text-white mt-[10px]"
          loading={withdrawing}
          onClick={() => {
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
      </div>
    </div>
  );
}
