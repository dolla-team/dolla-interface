import { useMemo } from "react";
import { getSpilledAmount } from "@/utils/pool";
import clsx from "clsx";
import Particles from "@/components/animations/Particles";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { InfoIcon } from "@/views/profile/player/records/bid-history";
import ProgressAvatar from "@/views/btc/detail/end/progress-avatar";
import { formatNumber } from "@/utils/format/number";

export default function FillLevel({
  data,
  winnerBidsProgress,
  winnerBidList
}: any) {
  const [progress, spilled, spilledPercent] = useMemo(() => {
    return getSpilledAmount(data);
  }, [data]);
  console.log(spilledPercent);
  return (
    <>
      <div className="flex items-center gap-[6px]">
        <div className="text-[14px] text-black/60">Heat</div>
        <HeatInfo />
      </div>
      <div className="flex items-center justify-between pb-[26px]">
        <div className="text-[24px] text-black font-[600]">
          {progress.toFixed(2)}%
        </div>
        {spilled > 0 && (
          <div className="flex items-center gap-[2px]">
            <div className="w-[10px] h-[10px] rounded-full bg-[#F19D00]" />
            <div className="text-[12px] text-black font-[600]">
              Overfilled +
              {formatNumber(spilled, 2, true, { isShort: true, prefix: "$" })}
            </div>
          </div>
        )}
      </div>

      <ProgressBar
        data={data}
        progress={progress}
        winnerBidsProgress={winnerBidsProgress || []}
        winnerBidList={winnerBidList || []}
        spilledPercent={spilledPercent}
      />
    </>
  );
}

function ProgressBar({
  data,
  progress,
  winnerBidsProgress,
  winnerBidList,
  spilledPercent
}: any) {
  const ProcessAvatars = () => {
    return (
      data?.status === 2 &&
      winnerBidsProgress?.map((item: any, index: number) => (
        <div
          className="absolute top-[-33px] cursor-pointer hover:scale-[1.2] hover:z-[3] transition-all duration-300"
          style={{ left: `calc(${item * 100}% - 14px)` }}
        >
          <ProgressAvatar
            data={data}
            winnerBid={winnerBidList[index]}
            className="!rounded-full"
          />
        </div>
      ))
    );
  };
  if (spilledPercent > 0) {
    return (
      <div className="relative w-[396px] flex items-center">
        <ProcessAvatars />
        <div
          className={clsx(
            "h-[14px] rounded-[8px]",
            data?.status === 1 ? "bg-[#FFC42F]" : "bg-[#ABABAB]"
          )}
          style={{
            width: (100 - spilledPercent)! + "%"
          }}
        />
        <div
          className={clsx(
            "h-[14px] rounded-[8px]",
            data?.status === 1 ? "bg-[#F19D00]" : "bg-[#858585]"
          )}
          style={{
            width: spilledPercent! + "%"
          }}
        />
        {data?.status === 1 && <Particles />}
      </div>
    );
  }
  return (
    <div className="relative w-[396px]">
      <div
        className={clsx(
          "h-[14px] rounded-[8px] bg-[#0000001A] absolute top-0 left-0 z-[1]"
        )}
      />
      <div
        className={clsx(
          "h-[14px] relative top-[0px] left-[0px] z-[2]",
          progress >= 100 ? "rounded-[14px]" : "rounded-l-[14px]",
          data?.status === 1 ? "bg-[#FFB700]" : "bg-[#ABABAB]"
        )}
        style={{
          width: `${Math.min(progress, 100)}%`
        }}
      >
        <ProcessAvatars />
        {progress >= 80 && progress < 100 && data?.status === 1 && (
          <Particles />
        )}
      </div>
    </div>
  );
}

const HeatInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.TopLeft}
      content={
        <div className="w-[298px] text-[12px] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="font-[500] text-black">Heat</div>
          <div className="text-[#5E6B7D] font-[300] mt-[4px] leading-[120%]">
            Attempts volume relative to value.
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
