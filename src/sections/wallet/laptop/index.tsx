import Info from "../panels/info";
import Deposit from "../panels/deposit";
import Withdraw from "../panels/withdraw";
import Swap from "../panels/swap";
import { motion, AnimatePresence } from "framer-motion";
import useWalletStore from "@/stores/use-wallet";

import { useEffect, useMemo } from "react";
import clsx from "clsx";
import useIsBtc from "@/hooks/use-is-btc";

export default function Laptop() {
  const walletStore = useWalletStore();
  const isBtc = useIsBtc();

  const colorStyle = useMemo(() => {
    return !isBtc
      ? {
          background:
            "radial-gradient(75.31% 36.96% at 1.18% 2.95%, rgba(111, 55, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 100%)"
        }
      : {
          background:
            "radial-gradient(75.31% 36.96% at 1.18% 2.95%, rgba(255, 196, 47, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 100%)"
        };
  }, [isBtc]);

  const handleToggle = () => {
    walletStore.init();
  };

  useEffect(() => {
    document.addEventListener("click", handleToggle);
    return () => {
      document.removeEventListener("click", handleToggle);
    };
  }, []);

  return (
    <>
      {/* Main panel with slide animation */}
      <AnimatePresence>
        {walletStore.showWallet && (
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className={clsx(
              "fixed bottom-0 right-0 z-[100] w-[416px] bg-[#141519CC] rounded-l-[20px] h-full"
            )}
          >
            <div
              className="h-full rounded-l-[20px] ml-[40px]"
              style={colorStyle}
              onClick={(e: any) => {
                e.stopPropagation();
              }}
            >
              {walletStore.panelType === "info" && (
                <Info
                  onTabChange={(tab: string) => {
                    walletStore.set({
                      panelType: tab
                    });
                  }}
                />
              )}
              {walletStore.panelType === "deposit" && (
                <Deposit
                  onBack={() => {
                    walletStore.set({ panelType: "info" });
                  }}
                />
              )}
              {walletStore.panelType === "withdraw" && (
                <Withdraw
                  onBack={() => {
                    walletStore.set({ panelType: "info" });
                  }}
                />
              )}
              {walletStore.panelType === "swap" && (
                <Swap
                  onBack={() => {
                    walletStore.set({ panelType: "info" });
                  }}
                />
              )}
            </div>
            <div className="absolute top-[30px] left-[15px] cursor-pointer">
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L8 9L1 17"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
