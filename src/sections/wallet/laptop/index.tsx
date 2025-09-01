import Info from "../panels/info";
import Deposit from "../panels/deposit";
import Withdraw from "../panels/withdraw";
import Swap from "../panels/swap";
import { motion, AnimatePresence } from "framer-motion";
import useWalletStore from "@/stores/use-wallet";
import { useEffect } from "react";

export default function Laptop() {
  const walletStore = useWalletStore();

  const handleToggle = () => {
    walletStore.set({ showWallet: false });
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
            initial={{ x: 456 }}
            animate={{ x: 0 }}
            exit={{ x: 456 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="fixed bottom-0 right-0 z-[100] h-[calc(100vh-112px)] w-[416px] border-l border-[#383F47] bg-[#1C1C23]"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
