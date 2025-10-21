import Info from "../panels/info";
import Deposit from "../panels/deposit";
import Withdraw from "../panels/withdraw";
import Swap from "../panels/swap";
import Token from "../panels/token";
import { motion, AnimatePresence } from "framer-motion";
import useWalletStore from "@/stores/use-wallet";
import { useMemo } from "react";
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
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.20)",
          background:
            "radial-gradient(75.31% 36.96% at 1.18% 2.95%, rgba(255, 196, 47, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 100%)"
        };
  }, [isBtc]);

  return (
    <>
      {/* Main panel with slide animation */}
      <AnimatePresence>
        {walletStore.showWallet && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className={clsx(
              "fixed bottom-[6px] right-[6px] z-[100] w-[320px] rounded-[20px] h-[calc(100%-12px)]"
            )}
          >
            <div
              className="h-full rounded-[20px]"
              style={colorStyle}
              onClick={(e: any) => {
                e.stopPropagation();
              }}
            >
              {walletStore.panelType === "info" && (
                <Info
                  onTabChange={(tab: string) => {
                    walletStore.set({
                      panelType: tab,
                      depositPanelType: "token-selector",
                      from: ""
                    });
                  }}
                />
              )}
              {walletStore.panelType === "deposit" && (
                <Deposit
                  onBack={() => {
                    walletStore.set({
                      panelType: "info",
                      depositMethod: "centralized-exchange"
                    });
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
              {walletStore.panelType === "token" && <Token />}
            </div>
            <button
              className="absolute top-[20px] right-[16px] button"
              onClick={() => {
                walletStore.init();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M0.334961 0.295898C0.721676 -0.0983983 1.34864 -0.0983983 1.73535 0.295898L6.2334 4.88184L10.6777 0.351562C11.0644 -0.0427343 11.6924 -0.0427343 12.0791 0.351562C12.4653 0.74587 12.4656 1.38515 12.0791 1.7793L7.63379 6.31055L12.124 10.8877C12.5104 11.282 12.5105 11.9212 12.124 12.3154C11.7374 12.7096 11.1104 12.7094 10.7236 12.3154L6.2334 7.73828L1.69043 12.3711C1.30376 12.7653 0.676747 12.7652 0.290039 12.3711C-0.0966393 11.9768 -0.0965661 11.3377 0.290039 10.9434L4.83301 6.30957L0.334961 1.72363C-0.0516867 1.3294 -0.051552 0.690212 0.334961 0.295898Z"
                  fill="black"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
