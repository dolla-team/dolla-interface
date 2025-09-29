import BackIcon from "@/sections/wallet/back-icon";
import Recharge from "./recharge";
import { useState, useEffect, useMemo } from "react";
import Big from "big.js";
import useWalletStore from "@/stores/use-wallet";
import { useDebounce } from "ahooks";
import { useContractConfigStore } from "@/stores/use-contract-config";
import useToast from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import useDeposit from "@/hooks/near/use-deposit";
import Loading from "@/components/icons/loading";
import ChainSelector from "./chain-selector";

export default function RechargeFrom1click() {
  const [quote, setQuote] = useState<any>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [amount, setAmount] = useState("1");
  const [chain, setChain] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { address } = useAuth();
  const walletStore = useWalletStore();
  const debouncedAmount = useDebounce(amount, { wait: 1000 });
  const config = useContractConfigStore((state) => state.config);
  const { generateDepositAddress } = useDeposit();

  useEffect(() => {
    if (walletStore.defaultDepositAmount) {
      setAmount(walletStore.defaultDepositAmount);
    }
  }, [walletStore.defaultDepositAmount]);

  useEffect(() => {
    if (debouncedAmount && chain && address) {
      (async () => {
        try {
          setQuote(null);
          setLoading(true);
          const qoute = await generateDepositAddress({
            originAsset: chain.assetId,
            destinationAsset: walletStore.selectedToken.assetId,
            amount: new Big(debouncedAmount)
              .mul(10 ** walletStore.selectedToken.decimals)
              .toString(),
            evmAddress: address || "",
            slippageTolerance: 50,
            refundTo: address || "",
            getFullQuote: true
          });
          setQuote(qoute);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      })();
    }
  }, [debouncedAmount, chain, address, config]);

  const errorTips = useMemo(() => {
    if (debouncedAmount === "") return "Input amount";

    if (!chain) return "Select a chain";

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
  }, [debouncedAmount, walletStore.selectedToken, quote]);

  return (
    <div className="pb-[20px] relative">
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={() => {
          if (showAddress) {
            setShowAddress(false);
          } else {
            walletStore.set({ depositPanelType: "token-selector" });
          }
        }}
      >
        <BackIcon />
        <div className="text-[#4c4789] text-[12px]">Back</div>
      </div>

      {!showAddress && (
        <div className="py-[20px]">
          <div className="relative h-[calc(100vh-100px)]">
            <div className="text-[16px] text-center text-black mb-[20px]">
              Input Deposit Amount
            </div>

            <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] px-[16px] h-[60px] flex items-center justify-between">
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
                  className="text-[24px] text-black text-right bg-transparent border-none outline-none w-[80px]"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-[10px]">
              <div className="text-[12px] text-[#8A87AA]">Est. Receive</div>
              <div className="text-[14px] text-black font-[600]">
                {quote ? quote.amountOutFormatted : "-"}
              </div>
            </div>

            <div className="mt-[10px] text-[12px] leading-[18px] text-[#8A87AA]">
              The third-party bridge service will be used during the recharge
              process, which requires at least an additional recharge of{" "}
              <span className="font-bold text-black">
                {!isNaN(Number(amount)) ? Number(amount) * 0.0001 : "-"}
              </span>
            </div>
            <ChainSelector
              selectedChain={chain}
              onSelect={(chain: any) => {
                setChain(chain);
              }}
              className="max-h-[calc(100vh-440px)]"
            />

            <div className="absolute bottom-0 left-0 right-0">
              {quote &&
                quote.amountOut &&
                Number(quote.amountOut) < Number(amount) && (
                  <div className="bg-[#FFE5E5] rounded-[12px] px-[16px] py-[12px] text-center pb-[24px] mb-[-10px]">
                    <div className="text-[#FF3D2F] text-[12px] font-[400] leading-[120%]">
                      You may only receive{" "}
                      <span className="font-bold">
                        -{quote ? quote.amountOut : "-"}{" "}
                        {walletStore.selectedToken?.symbol || "-"}
                      </span>
                      , which is not enough to create a minimal market.
                    </div>
                  </div>
                )}

              <button
                disabled={loading || !quote}
                className="w-full bg-black cursor-pointer text-white text-[14px] font-[400] rounded-[12px] py-[14px] transition-colors duration-200 hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (quote || loading) {
                    setShowAddress(true);
                  }
                }}
              >
                {loading ? <Loading size={20} /> : errorTips || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddress && quote && (
        <>
          <div className="pt-[50px]">
            <Recharge
              token={walletStore.selectedToken}
              address={quote?.depositAddress}
              chain={chain}
            />

            <div className="flex justify-between items-center mt-[20px] px-[10px]">
              <div className="text-[14px] text-[#8A87AA]">Minimum Receive</div>
              <div className="text-[14px] text-[#8A87AA]">
                {quote?.minAmountOut
                  ? new Big(quote?.minAmountOut)
                      .div(10 ** walletStore.selectedToken?.decimals)
                      .toString()
                  : "-"}{" "}
                {walletStore.selectedToken?.symbol}
              </div>
            </div>

            <div className="flex justify-between items-center mt-[20px] px-[10px]">
              <div className="text-[14px] text-[#8A87AA]">Cost time</div>
              <div className="text-[14px] text-[#8A87AA]">
                {quote?.costTime || "~"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
