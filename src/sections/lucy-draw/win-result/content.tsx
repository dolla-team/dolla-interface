import clsx from "clsx";
import Loading from "@/components/icons/loading";
import useIsMobile from "@/hooks/use-is-mobile";

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
      <div
        className={clsx(
          "font-[DelaGothicOne]",
          isMobile ? "text-[24px] text-center mt-[10px]" : "text-[18px]"
        )}
      >
        Congrats!{" "}
      </div>
      {/* Description */}
      <div
        className={clsx(
          "font-[DelaGothicOne] text-[14px]",
          isMobile && "text-center leading-[100%] mt-[16px]"
        )}
      >
        You won ${currentWinner.volume} from Lucky Draw #
        {currentWinner.prize_draw_id}.{" "}
      </div>
      {/* Action buttons */}
      <div
        className={clsx(
          "flex items-center justify-between",
          isMobile ? "flex-col mt-[14px]" : ""
        )}
      >
        <button
          className={clsx(
            "underline button",
            isMobile ? "text-[14px]" : "text-[12px]"
          )}
          onClick={() => {
            onShowHistory(currentWinner?.prize_draw_id || 1);
          }}
        >
          Winning Result
        </button>
        <button
          onClick={() => {
            if (isClaiming) return;
            claim(currentWinner.ids);
          }}
          className={clsx(
            "bg-linear-to-b from-[#FFF698] to-[#FFC42F] rounded-[8px] ",
            isClaiming ? "opacity-50" : "button",
            isMobile
              ? "w-[94px] h-[32px] text-[16px] font-semibold mt-[14px]"
              : "w-[72px] h-[24px] text-[12px]"
          )}
        >
          {isClaiming ? <Loading size={12} /> : "Claim"}
        </button>
      </div>
    </>
  );
}
