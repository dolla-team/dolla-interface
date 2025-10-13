import { motion, AnimatePresence } from "framer-motion";
import WinResultContent from "./content";
import ReactDOM from "react-dom";
import { useGlobalStore } from "@/stores/use-global";

export default function WinResult({
  currentWinner,
  isClaiming,
  claim,
  onShowHistory
}: any) {
  const globalStore = useGlobalStore();
  return ReactDOM.createPortal(
    <AnimatePresence>
      {currentWinner && (
        <motion.div
          initial={{ x: 300, opacity: 0 }} // Slide in from right
          animate={{ x: 0, opacity: 1 }} // Animate to center
          exit={{ x: 300, opacity: 0 }} // Slide out to right
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-[10px] right-[10px] z-[50] w-[250px] h-[124px] border border-[#D9D9D9] rounded-[12px] text-black py-[8px] px-[10px] mb-[10px] shadow-[0_0_20px_0_rgba(132,101,255,0.20)] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lucky-draw/lucky-draw-result.png')",
            backgroundSize: "120% 150%",
            right: globalStore.showUserInfo ? "300px" : "10px"
          }}
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
