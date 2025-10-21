import { formatNumber } from "@/utils/format/number";
import BackIcon from "../../back-icon";
import useWalletStore from "@/stores/use-wallet";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";
import useTokenPrice from "@/hooks/use-token-price";
import Big from "big.js";
import { PANELS } from "../info";

export default function Token() {
  const walletStore = useWalletStore();
  const { nearAccount } = useAuth() || {};

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

  const balance = walletStore.selectedToken?.isBaseToken
    ? nearAccount?.prizeBalance
    : nearAccount?.balance;

  return (
    <div>
      <div
        className="px-[16px] pt-[16px] flex items-center gap-[8px] text-[16px] cursor-pointer button"
        onClick={() => {
          walletStore.set({ panelType: "info" });
        }}
      >
        <BackIcon />
        <div className="text-black text-[14px]">
          {walletStore.selectedToken.symbol}
        </div>
      </div>
      <div className="text-center mt-[40px] mb-[8px] flex items-center justify-center gap-[4px]">
        <img
          src={walletStore.selectedToken.icon}
          className="w-[26px] h-[26px] object-cover"
        />
        <span className="text-[14px] font-[400]">
          {walletStore.selectedToken?.symbol}
        </span>
      </div>
      <div className="text-center text-[32px] font-[700] truncate text-black">
        <span className="mr-[4px]">
          {formatNumber(
            balance,
            walletStore.selectedToken?.isBaseToken ? 6 : 2,
            true
          )}{" "}
        </span>
      </div>
      <div className="text-[12px] text-[#8A87AA] text-center mt-[10px]">
        $
        {formatNumber(
          Big(balance || 0)
            .mul(tokenPrice || 0)
            .toString(),
          2,
          true
        )}
      </div>
      <div className="mx-[16px] mt-[8px] py-[4px] rounded-[10px] border border-[#FFC42F] bg-[#FFC42F33] h-[46px] text-center text-[12px] text-black">
        {walletStore.selectedToken.isBaseToken ? (
          <>
            <div>BTC is the market creation assets </div>
            <div>on Dolla</div>
          </>
        ) : (
          <>
            <div>USDT is the bid assets on Dolla</div>
            <div>1Bid = 1 USDT</div>
          </>
        )}
      </div>
      <div className="px-[20px] flex items-center gap-[14px] mt-[16px] text-black border-b border-b-[#D9D9D9] pb-[20px]">
        {PANELS.map((panel) => (
          <div
            key={panel.label}
            className="button flex flex-col items-center justify-center gap-[4px] w-[116px] h-[60px] rounded-[10px] bg-[#0000000D]"
            onClick={() => {
              const params: any = {
                panelType: panel.label.toLowerCase(),
                from: "token"
              };
              if (panel.label.toLowerCase() === "deposit") {
                params.depositPanelType = "input";
                params.depositMethod = "centralized-exchange";
              }
              if (panel.label.toLowerCase() === "withdraw") {
                params.withdrawPanelType = "input";
              }
              walletStore.set(params);
            }}
          >
            {panel.icon}
            <div className="text-[12px]">{panel.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
