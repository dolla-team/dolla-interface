import { motion, AnimatePresence } from "framer-motion";
import useWalletStore from "@/stores/use-wallet";
import Actions from "./actions";
import Level from "./level";
import Info from "./info";
import StarterObjectives from "./starter-objectives";
import { useEffect } from "react";
import clsx from "clsx";

export default function Laptop() {
  const walletStore = useWalletStore();

  useEffect(() => {
    const handleToggle = () => {
      walletStore.set({ showUserInfo: false });
    };

    document.addEventListener("click", handleToggle);
    return () => {
      document.removeEventListener("click", handleToggle);
    };
  }, []);

  return (
    <>
      {/* Main panel with slide animation */}
      <AnimatePresence>
        {walletStore.showUserInfo && (
          <motion.div
            initial={{ x: 352 }}
            animate={{ x: 0 }}
            exit={{ x: 352 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className={clsx(
              "fixed bottom-0 right-0 z-[100] w-[352px] bg-[#1C1C23]",
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
                <div className="text-[12px] font-medium">$1</div>
              </div>
              <div className="flex justify-between items-center text-white mt-[10px]">
                <div className="text-[10px]">Played</div>
                <div className="text-[12px] font-medium">1</div>
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
