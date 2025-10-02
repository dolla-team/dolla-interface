import { motion, AnimatePresence } from "framer-motion";
import WinResultContent from "./content";
import ReactDOM from "react-dom";

export default function WinResult({
  currentWinner,
  isClaiming,
  claim,
  onShowHistory
}: any) {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {currentWinner && (
        <motion.div
          initial={{ x: 300, opacity: 0 }} // Slide in from right
          animate={{ x: 0, opacity: 1 }} // Animate to center
          exit={{ x: 300, opacity: 0 }} // Slide out to right
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-[10px] right-[10px] z-[50] w-[250px] h-[104px] rounded-[12px] bg-linear-to-b from-[#4FFF61] to-[#2F993A] text-black py-[6px] px-[10px] mb-[10px]"
        >
          <WinResultContent
            onShowHistory={onShowHistory}
            isClaiming={isClaiming}
            currentWinner={currentWinner}
            claim={claim}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
