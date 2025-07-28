import Loading from "@/components/icons/loading";
import useClaim from "../use-claim";
import clsx from "clsx";
import useUserWinnerList from "../use-user-winner-list";
import { motion, AnimatePresence } from "framer-motion";

export default function WinResult({
  onShowHistory
}: {
  onShowHistory: (round: number) => void;
}) {
  const { currentWinner, getCurrentWinner } = useUserWinnerList();
  const { claim, isClaiming } = useClaim({
    onClaimSuccess: getCurrentWinner
  });

  return (
    <AnimatePresence>
      {currentWinner && (
        <motion.div
          initial={{ x: 300, opacity: 0 }} // Slide in from right
          animate={{ x: 0, opacity: 1 }} // Animate to center
          exit={{ x: 300, opacity: 0 }} // Slide out to right
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-[250px] h-[104px] rounded-[12px] bg-linear-to-b from-[#4FFF61] to-[#2F993A] text-black py-[6px] px-[10px] mb-[10px]"
        >
          {/* Title */}
          <div className="text-[18px] font-[DelaGothicOne]">Congrats! </div>
          {/* Description */}
          <div className="text-[14px] font-[DelaGothicOne]">
            You won ${currentWinner.volume} from Lucky Draw #
            {currentWinner.prize_draw_id}.{" "}
          </div>
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button
              className="text-[12px] underline button"
              onClick={() => {
                onShowHistory(1);
              }}
            >
              Winning Result
            </button>
            <button
              onClick={() => {
                if (isClaiming) return;
                if (currentWinner?.ids) {
                  claim(currentWinner.ids);
                }
              }}
              className={clsx(
                "w-[72px] h-[24px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] rounded-[8px] text-[12px]",
                isClaiming ? "opacity-50" : "button"
              )}
            >
              {isClaiming ? <Loading size={12} /> : "Claim"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}