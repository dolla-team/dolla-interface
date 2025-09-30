import { motion, AnimatePresence } from "framer-motion";
import Actions from "./actions";
import Level from "./level";
import Info from "./info";
import StarterObjectives from "./starter-objectives";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";
import { useGlobalStore } from "@/stores/use-global";
import useWalletStore from "@/stores/use-wallet";

export default function Laptop() {
  const globalStore = useGlobalStore();
  const walletStore = useWalletStore();
  const { nearAccount } = useAuth();

  return (
    <>
      {/* Main panel with slide animation */}
      <AnimatePresence>
        {globalStore.showUserInfo && (
          <motion.div
            initial={{ x: 294 }}
            animate={{ x: 0 }}
            exit={{ x: 294 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className={clsx(
              "fixed bottom-0 right-0 z-[5] w-[294px] bg-[#1C1C23]",
              walletStore.showInfos
                ? "h-[calc(100%-112px)]"
                : "h-[calc(100%-76px)]"
            )}
            onClick={(e: any) => {
              e.stopPropagation();
            }}
          >
            <div className="p-[20px]">
              <Info />
              <Level />
              <div className="flex justify-between items-center text-white mt-[26px]">
                <div className="text-[10px]">Total bid</div>
                <div className="text-[12px] font-medium">
                  ${nearAccount?.acc_bet_amount}
                </div>
              </div>
              <div className="flex justify-between items-center text-white mt-[10px]">
                <div className="text-[10px]">Played</div>
                <div className="text-[12px] font-medium">
                  {nearAccount?.acc_bets}
                </div>
              </div>
            </div>
            <StarterObjectives />
            <Actions />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
