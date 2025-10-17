import clsx from "clsx";
import useIsMobile from "@/hooks/use-is-mobile";
import { formatNumber } from "@/utils/format/number";
import Button from "@/components/button";
import { motion } from "framer-motion";

export default function WinResultContent({
  onShowHistory,
  isClaiming,
  currentWinner,
  claim
}: any) {
  const isMobile = useIsMobile();
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }} // Slide in from right
      animate={{ x: 0, opacity: 1 }} // Animate to center
      exit={{ x: 300, opacity: 0 }} // Slide out to right
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-[250px] h-[124px] border border-[#D9D9D9] rounded-[12px] text-black py-[8px] px-[10px] mb-[10px] shadow-[0_0_20px_0_rgba(132,101,255,0.20)] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lucky-draw/lucky-draw-result.png')",
        backgroundSize: "120% 150%"
      }}
    >
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
          "text-[10px] h-[40px] mt-[4px]",
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
    </motion.div>
  );
}
