import { useMemo } from "react";
import { getSpilledAmount } from "@/utils/pool";
import clsx from "clsx";
import Particles from "@/components/animations/Particles";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { InfoIcon } from "@/views/profile/player/records/bid-history";
import { ProgressAvatar } from "@/views/btc/detail/end";

export default function FillLevel({ data, winnerBidsProgress }: any) {
  const [progress] = useMemo(() => {
    return getSpilledAmount(data);
  }, [data]);

  return (
    <>
      <div className="flex items-center gap-[6px]">
        <div className="text-[14px] text-black/60">Heat</div>
        <HeatInfo />
      </div>
      <div className="text-[24px] text-black font-[600]">
        {progress.toFixed(2)}%
      </div>
      {data?.status === 2 ? (
        <div className="w-[396px] mt-[34px] relative">
          {winnerBidsProgress?.map((item: any, index: number) => (
            <ProgressAvatar
              data={data}
              progress={item}
              key={index}
              index={index}
              className="!rounded-full"
            />
          ))}
        </div>
      ) : (
        <div className="h-[20px]" />
      )}
      <ProgressBar data={data} winnerBidsProgress={winnerBidsProgress} />
    </>
  );
}

function ProgressBar({ data }: any) {
  const [progress] = useMemo(() => {
    return getSpilledAmount(data);
  }, [data]);

  return (
    <div className="relative w-[396px]">
      <div
        className={clsx(
          "h-[14px] w-full rounded-[8px] bg-[#0000001A] absolute top-0 left-0 z-[1]"
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
        {progress >= 80 && progress < 100 && data?.status !== 3 && (
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
