import clsx from "clsx";
import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { formatNumber } from "@/utils/format/number";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { InfoIcon } from "@/views/profile/player/records/bid-history";
import BidsChart from "./bids-chart";
import { useBtcContext } from "@/views/btc/context";

// Register Chart.js components
Chart.register(...registerables);

export default function TotalBids({ data }: { data: any }) {
  const { pool } = useBtcContext();
  const [active, setActive] = useState<{
    label: string;
    value: number;
    period: "1d" | "1w" | "1m" | "all";
  }>({
    label: "All",
    value: 0,
    period: "all"
  });

  return (
    <div className="w-[426px] relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <div className="text-[14px] text-black/60">Volume</div>
          <VolumeInfo />
        </div>
        <div className="flex">
          {[
            { label: "1D", value: 1, period: "1d" as const },
            { label: "1W", value: 7, period: "1w" as const },
            { label: "1M", value: 30, period: "1m" as const },
            { label: "All", value: 0, period: "all" as const }
          ].map((item) => (
            <div
              key={item.value}
              className={clsx(
                "w-[46px] h-[30px] flex items-center justify-center rounded-[8px] text-[12px] text-black cursor-pointer",
                item.value === active.value
                  ? "border border-[#F2F2F233] bg-[#0000000D]"
                  : "opacity-60"
              )}
              onClick={() => setActive(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute  z-[2]">
        <div className="text-[24px] font-[600] text-black">
          {formatNumber(data?.accumulative_bids, 0, true, { prefix: "$" })}
        </div>
        <div className="text-[14px] text-black/60">{active.label}-Time</div>
      </div>
      <BidsChart
        chain="near"
        period={active.period}
        pool_id={pool?.pool_id || 0}
        status={pool?.status || 0}
        winnerInfo={pool?.winner_user_info}
      />
    </div>
  );
}

const VolumeInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.TopLeft}
      content={
        <div className="w-[298px] text-[12px] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="font-[500] text-black">Volume</div>
          <div className="text-[#5E6B7D] font-[300] mt-[4px] leading-[120%]">
            Total volume attempted to acquire the exposure.
          </div>
        </div>
      }
    >
      <button className="relative transition-opacity button flex items-center justify-center">
        <InfoIcon />
      </button>
    </Popover>
  );
};
