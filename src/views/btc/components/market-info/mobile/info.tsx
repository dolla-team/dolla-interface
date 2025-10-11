import dayjs from "@/libs/dayjs";
import MarketSize from "../../bid-selection/mobile/market-size";

export default function Info({ pool }: { pool: any }) {
  return (
    <div>
      <MarketSize hasBg={false} className="!mt-0 !ml-0" />
      <div className="flex gap-[8px] mx-[4px]">
        <div className="w-1/3 rounded-[10px] bg-[#000]/50 border border-[#605D55] h-[66px] flex flex-col justify-center items-center">
          <div className="text-[14px] text-[#FFE9B2]">Total Players</div>
          <div className="text-[16px] text-white font-[DelaGothicOne]">
            {pool?.participants}
          </div>
        </div>
        <div className="w-1/3 rounded-[10px] bg-[#000]/50 border border-[#605D55] h-[66px] flex flex-col justify-center items-center">
          <div className="text-[14px] text-[#FFE9B2]">Total Bid</div>
          <div className="text-[16px] text-white font-[DelaGothicOne]">
            {pool?.accumulative_bids}
          </div>
        </div>
        <div className="w-1/3 rounded-[10px] bg-[#000]/50 border border-[#605D55] h-[66px] flex flex-col justify-center items-center">
          <div className="text-[14px] text-[#FFE9B2]">Time Duration</div>
          <div className="text-[16px] text-white font-[DelaGothicOne]">
            {dayjs(pool?.end_time).diff(dayjs(pool?.start_time), "seconds")}
          </div>
        </div>
      </div>
    </div>
  );
}
