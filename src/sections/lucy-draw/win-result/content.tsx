import clsx from "clsx";
import Loading from "@/components/icons/loading";
import useIsMobile from "@/hooks/use-is-mobile";
import { formatNumber } from "@/utils/format/number";
import Button from "@/components/button";

export default function WinResultContent({
  onShowHistory,
  isClaiming,
  currentWinner,
  claim
}: any) {
  const isMobile = useIsMobile();
  return (
    <>
      {/* Title */}
      <div className="flex items-center justify-between">
        <div
          className={clsx(
            isMobile ? "text-[18px] text-center mt-[10px]" : "text-[18px]"
          )}
        >
          Congrats!{" "}
        </div>
        <button
          className={clsx(
            "underline button",
            isMobile ? "text-[14px]" : "text-[12px]"
          )}
          onClick={() => {
            onShowHistory(currentWinner?.prize_draw_id || 1);
          }}
        >
          History
        </button>
      </div>
      {/* Description */}
      <div
        className={clsx(
          "text-[12px] h-[44px]",
          isMobile && "text-center leading-[100%] mt-[4px]"
        )}
      >
        You won ${formatNumber(currentWinner.volume, 3, true)} from Lucky Draw #
        {currentWinner.prize_draw_id}.{" "}
      </div>
      {/* Action buttons */}
      <div
        className={clsx(
          "flex items-center justify-between",
          isMobile ? "flex-col mt-[14px]" : ""
        )}
      >
        <div className="text-[12px] text-black">Prize:</div>
        <div className="flex items-center gap-[10px]">
          <div className="text-[14px] font-[600] text-black">
            ${formatNumber(currentWinner.volume, 3, true)}
          </div>
          <Button
            onClick={() => {
              if (isClaiming) return;
              claim(currentWinner.ids);
            }}
            className={clsx(
              "!bg-[#000] !text-white w-[78px] h-[32px] !rounded-[8px]"
            )}
            loading={isClaiming}
          >
            Claim
          </Button>
        </div>
      </div>
    </>
  );
}
