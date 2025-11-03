import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import { useMemo } from "react";
import { getSpilledAmount } from "@/utils/pool";
import Particles from "@/components/animations/Particles";

export default function Progress({ data }: any) {
  const [progress, spilled, spilledPercent] = useMemo(() => {
    return getSpilledAmount(data);
  }, [data]);

  return (
    <div className="relative">
      <div
        className={clsx(
          "h-[12px] rounded-[30px] border bg-[#FFFFFF1A] absolute top-0 left-0 z-[1]",
          data?.status === 3 ? "border-[#4E4E4E]" : "border-[#3B3951]"
        )}
        style={{
          width: spilled > 0 ? 100 - spilledPercent! + "%" : "100%"
        }}
      />
      <div className="h-[10px] rounded-[10px] p-[1px] relative top-[1px] left-[1px] z-[2]">
        <div
          className={clsx(
            "rounded-[10px] h-[8px] border relative",
            data?.status === 3
              ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)] border-[#4E4E4E]"
              : "bg-[linear-gradient(90deg,#A2623D_0%,#FFC42F_47.6%,#FFE9B2_100%)] border-[#4E4E4E]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress >= 80 && progress < 100 && data?.status !== 3 && (
            <Particles />
          )}
          <Label
            amount={data?.accumulative_bids || 0}
            disabled={data?.status === 3}
            progress={progress}
          />
        </div>
      </div>
      {spilled > 0 && (
        <>
          <div
            style={{ width: spilledPercent! + "%" }}
            className="absolute top-[4px] right-[1px] z-[3] h-[4px] bg-linear-to-r from-[#C637FF] to-[#FFADCF] rounded-r-[4px]"
          />
          <div className="absolute bottom-[14px] right-[0px]">
            <div className="text-[12px] text-white/50">Spilled</div>
            <div
              className="text-[16px] font-[600]"
              style={{
                background: "linear-gradient(90deg, #C637FF 0%, #FFADCF 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {formatNumber(spilled, 2, true, { isShort: true, prefix: "$" })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const Label = ({
  amount,
  progress,
  disabled
}: {
  amount: number;
  disabled: boolean;
  progress: number;
}) => {
  return (
    <div
      className={clsx(
        "absolute top-[10px] flex gap-[9px] w-[80px]",
        progress > 30
          ? "flex-row-reverse right-[0px]"
          : "flex-row right-[-76px]"
      )}
    >
      {/* <div className="w-[1px] h-[52px] bg-[#FFC42F]" /> */}
      <div className="pt-[10px]">
        <div className="text-[12px] text-white/50">Total Bid</div>
        <div
          className="text-[16px] font-[600]"
          style={
            disabled
              ? { color: "#C3C3C3" }
              : {
                  background:
                    "linear-gradient(90deg, #A2623D 0%, #FFC42F 47.6%, #FFE9B2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }
          }
        >
          {formatNumber(amount, 2, true, { isShort: true, prefix: "$" })}
        </div>
      </div>
    </div>
  );
};
