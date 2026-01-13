import { ProbabilityInfo } from "@/views/btc/components/market-info/laptop";
import { BID_UNITS } from "@/config";
import { useBtcContext } from "@/views/btc/context";
import clsx from "clsx";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import { CreditsInfo } from "@/views/btc/components/bid-selection/laptop";
import Points from "@/sections/points";
import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import { getAnchorPrice } from "@/utils/pool";

export default function Buy({
  disabled,
  balanceNotEnough,
  onBidClick
}: {
  disabled: boolean;
  balanceNotEnough: boolean;
  onBidClick: () => void;
}) {
  const { bids, setBids, pool, poolAmount, nearAccount, flipStatus } =
    useBtcContext();
  return (
    <div className="bg-white border border-[#E4E4E4] rounded-[20px] px-[30px] pb-[24px]">
      <div className="text-[16px] font-[600] text-black pt-[20px]">
        Bid for exposure to {poolAmount} {BASE_TOKEN.symbol}
      </div>
      <div className="flex items-center justify-between mt-[20px]">
        <div className="flex items-center gap-[4px]">
          <span className="text-[14px] text-black">Dolla Probability</span>
          <ProbabilityInfo />
        </div>
        <div className="text-[14px] text-black">
          1/
          {formatNumber(getAnchorPrice(pool?.anchor_price || 0), 0, true)}
        </div>
      </div>
      <div className="flex items-center h-[62px] p-[6px] bg-[#0000000D] border border-[#F2F2F233] rounded-[16px] mt-[20px]">
        {BID_UNITS.map((item) => (
          <button
            key={item}
            className={clsx(
              "button min-w-[50px] text-center h-[46px] rounded-[12px] text-[16px] text-black px-[30px] font-[700]",
              bids === item ? "bg-[#FFC42F]" : ""
            )}
            onClick={() => {
              setBids(item);
            }}
          >
            ${item}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-[14px] text-black mt-[20px]">
        <span>Balance</span>
        <span>
          {formatNumber(nearAccount?.balance || 0, 2, true)}{" "}
          {QUOTE_TOKEN.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between text-[14px] text-black mt-[20px]">
        <div className="flex items-center gap-[6px]">
          <span>Credits</span>
          <CreditsInfo />
        </div>
        <Points textClassName="!text-[14px] !text-black !font-[400]" />
      </div>
      <Button
        disabled={disabled || balanceNotEnough}
        loading={flipStatus === 1}
        className={clsx(
          "w-full mt-[20px] h-[60px] text-[20px] font-[700] rounded-[12px]",
          flipStatus === 2
            ? "!bg-[#4CB100] text-white"
            : "!bg-[#FFC42F] text-black"
        )}
        onClick={() => {
          if (disabled || balanceNotEnough) return;
          onBidClick();
        }}
      >
        {balanceNotEnough
          ? "Insufficient Balance"
          : flipStatus === 1
          ? "Bidding"
          : flipStatus === 2
          ? "Success"
          : "Bid"}
      </Button>
    </div>
  );
}
