import BackIcon from "@/sections/wallet/back-icon";
import Recharge from "./recharge";
import { useState, useEffect, useMemo, useRef } from "react";
import Big from "big.js";
import useWalletStore from "@/stores/use-wallet";
import { useContractConfigStore } from "@/stores/use-contract-config";
import useReport from "@/hooks/transaction/use-report";
import { useAuth } from "@/contexts/auth";
import useDeposit from "@/hooks/near/use-deposit";
import Loading from "@/components/icons/loading";
import ChainSelector from "./chain-selector";
import { EVM_REFUND_ACCOUNT, BTC_REFUND_ACCOUNT } from "@/config";
import { useDebounceFn } from "ahooks";
import WarningIcon from "./warning-icon";
import { BTC_DEPOSIT_AMOUNT } from "@/config/btc";

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
  const chainRef = useRef(null);

  const { run } = useDebounceFn(
    async () => {
      if (!chain || !walletStore.selectedToken) return;
      try {
        setQuote(null);
        setLoading(true);

        const decimals =
          chain?.blockchain === "bsc" ? 18 : walletStore.selectedToken.decimals;

        chainRef.current = chain.assetId;
        const res = await generateDepositAddress({
          originAsset: chain.assetId,
          destinationAsset: walletStore.selectedToken.assetId,
          amount:
            chain?.blockchain === "btc"
              ? BTC_DEPOSIT_AMOUNT
              : new Big(walletStore.selectedToken.minDepositAmount)
                  .mul(10 ** decimals)
                  .toString(),
          evmAddress: address || "",
          slippageTolerance: 50,
          swapType: "FLEX_INPUT",
          refundType: "ORIGIN_CHAIN",
          refundTo:
            chain.blockchain === "btc"
              ? BTC_REFUND_ACCOUNT
              : EVM_REFUND_ACCOUNT,
          getFullQuote: true
        });

        if (chainRef.current === res.quoteRequest.originAsset) {
          setQuote(res.quote);
        }

        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (chain && address) {
      run();
    }
  }, [chain, address, config]);

  const errorTips = useMemo(() => {
    if (!chain) return "Select a chain";

    return "";
  }, [chain]);

  return (
    <div className="pb-[20px] relative h-full">
      <div
        className="flex items-center gap-[8px] text-[16px] cursor-pointer button"
        onClick={() => {
          if (showAddress) {
            setShowAddress(false);
          } else {
            walletStore.set({ depositPanelType: "token-selector" });
          }
        }}
      >
        <BackIcon />
        <div className="text-black text-[14px]">Deposit</div>
      </div>

      {!showAddress && (
        <div className="pt-[20px]">
          <div className="text-[16px] font-[500] text-center mb-[16px]">
            Select Receiving Network
          </div>
          <div className="mt-[10px] py-[10px] px-[16px] text-[12px] text-center flex flex-col items-center leading-[18px] text-black font-[300] bg-[#FFC42F]/10 rounded-[12px]">
            <WarningIcon />
            <div>
              Please note that only supported networks on Dolla are shown, if
              you deposit via another network your assets maybe lost.
            </div>
          </div>
          <ChainSelector
            selectedChain={chain}
            onSelect={(chain: any) => {
              setChain(chain);
            }}
            className="h-[calc(100vh-390px)] mt-[10px]"
          />

          <div className="absolute bottom-[20px] left-0 right-0">
            <InfoPanel
              minDeposit={`> ${
                chain?.blockchain === "btc"
                  ? Number(BTC_DEPOSIT_AMOUNT) / 1e8
                  : walletStore.selectedToken.minDepositAmount
              } 
                ${chain?.symbol || walletStore.selectedToken.symbol}`}
              time={chain?.blockchain === "btc" ? "15" : "1"}
            />
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
      )}

      {showAddress && quote && (
        <div className="pt-[50px]">
          <Recharge
            token={walletStore.selectedToken}
            address={quote?.depositAddress}
            chain={chain}
          />
          <InfoPanel
            minDeposit={`> ${
              chain?.blockchain === "btc"
                ? Number(BTC_DEPOSIT_AMOUNT) / 1e8
                : walletStore.selectedToken.minDepositAmount
            } 
                ${chain?.symbol || walletStore.selectedToken.symbol}`}
            time={chain?.blockchain === "btc" ? "15" : "1"}
          />
          <div className="absolute bottom-[20px] left-0 w-full">
            <div className="text-[12px] text-[#8A87AA] text-center">
              Other way to deposit assets
            </div>
            <div
              onClick={() => {
                walletStore.set({
                  depositMethod: "coinbase",
                  depositPanelType: "token-selector"
                });
              }}
              className="w-full h-[56px] mt-[10px] rounded-[10px] border border-black/10 p-[10px] flex items-center justify-between button"
            >
              <div className="flex items-center gap-[8px]">
                <img
                  src="/fund/coinbase.png"
                  alt="Coinbase"
                  className="w-[36px] h-[36px] object-cover"
                />
                <div>
                  <div className="text-[12px] text-[#000]">Coinbase</div>
                  <div className="text-[10px] text-[#8A87AA]">
                    Instant Fees 0.5 - 2.5%
                  </div>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="16"
                viewBox="0 0 10 16"
                fill="none"
              >
                <path
                  d="M1 1L8 8L1 15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const InfoPanel = ({
  minDeposit,
  time
}: {
  minDeposit: string;
  time: string;
}) => {
  return (
    <div className="bg-[#2F6DFF]/10 rounded-[10px] py-[8px] px-[12px] text-black text-[12px] my-[12px]">
      <div className="flex justify-between items-center">
        <span>Min. deposit</span>
        <span>{minDeposit}</span>
      </div>
      <div className="flex justify-between items-center mt-[8px]">
        <span>Est. arrival</span>
        <span>≈ {time} mins</span>
      </div>
    </div>
  );
};
