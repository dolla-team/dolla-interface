import useWalletStore from "@/stores/use-wallet";
import { useEffect, useState, useMemo } from "react";
import ChainSelector from "../deposit/chain-selector";
import Loading from "@/components/icons/loading";
import BackIcon from "../../back-icon";
import { useAuth } from "@/contexts/auth";
import { formatNumber } from "@/utils/format/number";
import { useDebounce } from "ahooks";
import { quote } from "@/hooks/near/util";
import useWithdraw from "@/hooks/near/use-withdraw";
import Big from "big.js";
import dayjs from "dayjs";
import { isValidEVMAddress } from "@/utils/validate";
import { useContractConfigStore } from "@/stores/use-contract-config";

export default function WithdrawInput() {
  const walletStore = useWalletStore();
  const [amount, setAmount] = useState("");
  const { nearAccount } = useAuth();
  const [chain, setChain] = useState<any>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState("");
  const debouncedAmount = useDebounce(amount, { wait: 1000 });
  const balance = walletStore.selectedToken?.isBaseToken
    ? nearAccount?.prizeBalance
    : nearAccount?.balance;
  const { withdraw, loading: withdrawing } = useWithdraw(() => {
    setQuoteData(null);
    setReceiveAddress("");
    setAmount("");
    walletStore.set({ showWallet: false, withdrawPanelType: "token-selector" });
  });
  const config = useContractConfigStore((state) => state.config);

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
            refundTo: import.meta.env.VITE_NEAR_ACCOUNT_ID,
            refundType: "ORIGIN_CHAIN",
            recipient: receiveAddress,
            recipientType: "DESTINATION_CHAIN",
            deadline: dayjs().add(1, "hour").toISOString()
          });
          setQuoteData(res.quote);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      })();
    }
  }, [debouncedAmount, chain, receiveAddress]);

  const errorTips = useMemo(() => {
    if (!debouncedAmount) return "Input amount";
    if (Big(debouncedAmount).gt(Big(balance || 0))) {
      return "Insufficient Balance";
    }
    if (!chain) return "Select a chain";
    if (!receiveAddress) return "Input receive address";
    if (receiveAddress && !isValidEVMAddress(receiveAddress)) {
      return "Invalid EVM address format";
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
        return `Minimum deposit amount is ${minDepositAmount} ${walletStore.selectedToken.symbol}`;
      }
    }
    return "";
  }, [
    debouncedAmount,
    walletStore.selectedToken,
    quoteData,
    chain,
    receiveAddress
  ]);

  return (
    <div>
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={() => {
          walletStore.set({ withdrawPanelType: "token-selector" });
        }}
      >
        <BackIcon />
        <div className="text-[12px]">Withdraw</div>
      </div>
      <div className="relative h-[calc(100vh-100px)] mt-[30px]">
        <div className="flex items-center justify-between">
          <div className="text-[16px] text-black mb-[10px]">Input Amount</div>
          <button
            className="button text-black text-[12px]"
            onClick={() => {
              if (balance) setAmount(balance || 0);
            }}
          >
            Bal.{" "}
            <span className="underline">{formatNumber(balance, 3, true)}</span>
          </button>
        </div>

        <div className="w-full h-[60px] bg-white rounded-[12px] border border-[#E5E7EB] px-[12px] flex items-center justify-between">
          <div className="relative flex-1">
            <button className="w-full flex items-center gap-[12px] bg-white cursor-pointer rounded-[8px]">
              <div className="relative">
                <div className="w-[32px] h-[32px] flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    src={walletStore.selectedToken?.icon}
                  />
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="text-[16px] text-black">
                  {walletStore.selectedToken?.symbol}
                </div>
              </div>
            </button>
          </div>

          <div className="ml-[16px] flex flex-col items-end">
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
              className="text-[24px] text-black text-right bg-transparent border-none outline-none w-[200px]"
              placeholder="0"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-[4px]">
          <div className="text-[12px] text-[#8A87AA]">Est. Receive</div>
          <div className="text-[14px] text-black font-[600]">
            {quoteData ? quoteData.amountOutFormatted : "-"}
          </div>
        </div>
        <ChainSelector
          selectedChain={chain}
          onSelect={(chain: any) => {
            setChain(chain);
          }}
          className="max-h-[calc(100vh-440px)]"
        />

        <div className="absolute bottom-0 left-0 right-0">
          <div>
            <div className="text-[14px] text-black">Receive Address</div>
            <input
              className="w-full h-[47px] rounded-[10px] border border-[#8A87AA4D] leading-[47px] px-[12px] text-[12px] mt-[10px]"
              value={receiveAddress}
              onChange={(e) => {
                setReceiveAddress(e.target.value);
              }}
              placeholder="Address"
            />
          </div>
          <button
            disabled={loading || withdrawing || !quoteData}
            className="w-full mt-[20px] bg-black cursor-pointer text-white text-[14px] font-[400] rounded-[12px] py-[14px] transition-colors duration-200 hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (!quoteData?.depositAddress) return;
              withdraw({
                fromToken: walletStore.selectedToken,
                amount: amount,
                recipientAccount: quoteData.depositAddress
              });
            }}
          >
            {loading || withdrawing ? (
              <Loading size={20} />
            ) : (
              errorTips || "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
