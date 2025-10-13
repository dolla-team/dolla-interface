import useWalletStore from "@/stores/use-wallet";
import { useMemo } from "react";
import BackIcon from "../../back-icon";
import { formatNumber } from "@/utils/format/number";
import { useDebounce } from "ahooks";
import Big from "big.js";
import Button from "@/components/button";
import { useContractConfigStore } from "@/stores/use-contract-config";
import { BASE_TOKEN } from "@/config/btc";

export default function WithdrawInput({
  chain,
  amount,
  setAmount,
  balance,
  amountUSD
}: any) {
  const walletStore = useWalletStore();

  const debouncedAmount = useDebounce(amount, { wait: 1000 });

  const config = useContractConfigStore((state) => state.config);

  const errorTips = useMemo(() => {
    if (Big(debouncedAmount || 0).gt(Big(balance || 0))) {
      return "Insufficient Balance";
    }

    if (debouncedAmount && config) {
      let minDepositAmount = 0;
      const _config_tokens = walletStore.selectedToken?.isBaseToken
        ? config.legal_prize_ft_tokens
        : config.legal_bet_tokens;
      for (const token in _config_tokens) {
        const tokenObj = JSON.parse(token);
        if (
          tokenObj &&
          walletStore.selectedToken?.address
            .toUpperCase()
            .includes(tokenObj.FT?.toUpperCase())
        ) {
          minDepositAmount =
            Number(config.legal_bet_tokens[token]) /
            10 ** walletStore.selectedToken.decimals;
          break;
        }
      }

      if (Number(debouncedAmount) < minDepositAmount) {
        return `Minimum withdraw amount is ${minDepositAmount} ${walletStore.selectedToken.symbol}`;
      }
    }
    return "";
  }, [debouncedAmount, walletStore.selectedToken, chain]);

  return (
    <div>
      <div
        className="flex items-center gap-[8px] text-[16px] cursor-pointer button"
        onClick={() => {
          walletStore.set({ withdrawPanelType: "chain-selector" });
        }}
      >
        <BackIcon />
        <div className="text-black text-[14px]">Withdraw</div>
      </div>
      <div className="text-[16px] text-black font-[500] text-center mt-[20px] mb-[20px]">
        Enter an amount
      </div>
      <div className="ml-[16px] flex justify-center">
        <input
          type="text"
          value={amount}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers and decimal point
            const numericValue = value.replace(/[^0-9.]/g, "");
            // Prevent multiple decimal points
            const parts = numericValue.split(".");
            const validValue =
              parts.length > 2
                ? parts[0] + "." + parts.slice(1).join("")
                : numericValue;
            setAmount(validValue);
          }}
          className="text-[32px] text-black text-center bg-transparent border-none outline-none w-[200px]"
          placeholder="0"
          autoFocus
        />
      </div>
      <div className="text-[14px] text-black text-center mt-[20px]">
        ${amountUSD}
      </div>
      <div className="text-[12px] text-[#FF4372] text-center mt-[10px]">
        {errorTips}
      </div>
      <div className="mt-[20px] border border-black/10 rounded-[10px] p-[10px] flex justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <img
            className="w-[32px] h-[32px] object-cover"
            src={walletStore.selectedToken?.icon}
          />
          <div>
            <div className="text-[12px] text-[#8A87AA]">Balance</div>
            <div className="text-[12px] text-black">
              {formatNumber(
                balance,
                walletStore.selectedToken?.address === BASE_TOKEN.address
                  ? 6
                  : 2,
                true
              )}{" "}
              {walletStore.selectedToken?.symbol}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            if (balance) setAmount(balance || 0);
          }}
          className="button text-black text-[12px] w-[50px] h-[28px] rounded-[14px] border border-[#8A87AA4D]"
        >
          Max
        </button>
      </div>
      <Button
        disabled={!amount || !!errorTips}
        className="w-[300px] h-[50px] !bg-[black] !text-white !absolute bottom-[20px] left-[10px]"
        onClick={() => {
          walletStore.set({ withdrawPanelType: "withdraw-confirm" });
        }}
      >
        Next
      </Button>
    </div>
  );
}
