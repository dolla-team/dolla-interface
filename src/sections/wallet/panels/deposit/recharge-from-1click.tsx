import BackIcon from "@/sections/wallet/back-icon";
import Recharge from "./recharge";
import { useState, useEffect, useMemo } from "react";
import Big from "big.js";
import useWalletStore from "@/stores/use-wallet";
import { useDebounce } from "ahooks";
import { useContractConfigStore } from "@/stores/use-contract-config";
import useReport from "@/hooks/transaction/use-report";
import { useAuth } from "@/contexts/auth";
import useDeposit from "@/hooks/near/use-deposit";
import Loading from "@/components/icons/loading";
import ChainSelector from "./chain-selector";
import { formatNumber } from "@/utils/format/number";

export default function RechargeFrom1click() {
  const [quote, setQuote] = useState<any>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [chain, setChain] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { address } = useAuth();
  const walletStore = useWalletStore();
  const config = useContractConfigStore((state) => state.config);
  const { generateDepositAddress } = useDeposit();
  const { report } = useReport();

  useEffect(() => {
    if (chain && address) {
      (async () => {
        try {
          setQuote(null);
          setLoading(true);

          const decimals =
            chain.blockchain === "bsc"
              ? 18
              : walletStore.selectedToken.decimals;
          const qoute = await generateDepositAddress({
            originAsset: chain.assetId,
            destinationAsset: walletStore.selectedToken.assetId,
            amount: new Big(walletStore.selectedToken.minDepositAmount)
              .mul(10 ** decimals)
              .toString(),
            evmAddress: address || "",
            slippageTolerance: 50,
            swapType: "FLEX_INPUT",
            refundType: chain.blockchain === "btc" ? "INTENTS" : "ORIGIN_CHAIN",
            refundTo:
              chain.blockchain === "btc"
                ? import.meta.env.VITE_NEAR_ACCOUNT_ID
                : address,
            getFullQuote: true
          });
          console.log("qoute", qoute);
          setQuote(qoute);
          setLoading(false);
        } catch (error) {
          console.log("error", error);
          setLoading(false);
        }
      })();
    }
  }, [chain, address, config]);

  const errorTips = useMemo(() => {
    if (!chain) return "Select a chain";

    return "";
  }, [walletStore.selectedToken, quote]);

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
            {/* <div className="text-[16px] text-center text-black mb-[20px]">
              Input Deposit Amount
            </div> */}

            {/* <div className="w-full bg-white rounded-[12px] border border-[#E5E7EB] px-[16px] h-[60px] flex items-center justify-between">
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
                  className="text-[24px] text-black text-right bg-transparent border-none outline-none w-[120px]"
                  placeholder="0"
                />
              </div>
            </div> */}
            {/* <div className="flex items-center justify-between mt-[10px]">
              <div className="text-[12px] text-[#8A87AA]">Est. Receive</div>
              <div className="text-[14px] text-black font-[600]">
                {quote ? formatNumber(quote.amountOutFormatted, 6, true) : "-"}
              </div>
            </div> */}

            <div className="mt-[10px] text-[12px] leading-[18px] text-[#8A87AA]">
              <div>
                {" "}
                Please note that only supported networks on Dolla are shown, if
                you deposit via another network your assets maybe lost.
              </div>
              <div className="mt-[3px]">
                {" "}
                Min. deposit{" "}
                <span className="font-bold text-black">
                  &gt; {walletStore.selectedToken.minDepositAmount}{" "}
                  {walletStore.selectedToken.symbol}
                </span>
              </div>
              <div className="mt-[3px]"> Est. arrival ≈ 1 mins</div>
            </div>
            <ChainSelector
              selectedChain={chain}
              onSelect={(chain: any) => {
                setChain(chain);
              }}
              className="max-h-[calc(100vh-340px)]"
            />

            <div className="absolute bottom-0 left-0 right-0">
              <button
                disabled={loading || !quote}
                className="w-full bg-black cursor-pointer text-white text-[14px] font-[400] rounded-[12px] py-[14px] transition-colors duration-200 hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (quote || loading) {
                    setShowAddress(true);
                    report({
                      address: quote?.depositAddress,
                      type: "deposit"
                    });
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

            {/* <div className="flex justify-between items-center mt-[20px] px-[10px]">
              <div className="text-[14px] text-[#8A87AA]">Minimum Receive</div>
              <div className="text-[14px] text-[#8A87AA]">
                {quote?.minAmountOut
                  ? formatNumber(
                      new Big(quote?.minAmountOut)
                        .div(10 ** walletStore.selectedToken?.decimals)
                        .toString(),
                      6,
                      true
                    )
                  : "-"}{" "}
                {walletStore.selectedToken?.symbol}
              </div>
            </div> */}

            {/* <div className="flex justify-between items-center mt-[20px] px-[10px]">
              <div className="text-[14px] text-[#8A87AA]">Cost time</div>
              <div className="text-[14px] text-[#8A87AA]">
                {quote?.costTime || "~"}
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}
