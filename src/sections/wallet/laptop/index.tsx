import Info from "../panels/info";
import Deposit from "../panels/deposit";
import Withdraw from "../panels/withdraw";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWalletStore from "@/stores/use-wallet";

export default function Laptop() {
  const [tab, setTab] = useState("info");
  const { showWallet, set } = useWalletStore();

  const handleToggle = () => {
    set({ showWallet: !showWallet });
  };

  return (
    <>
      {/* Main panel with slide animation */}
      <AnimatePresence>
        {showWallet && (
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
            className="fixed top-0 right-0 z-[100] h-screen w-[416px] border-l border-[#383F47] rounded-l-[16px]"
            style={{
              background:
                "radial-gradient(75.31% 36.96% at 1.18% 2.95%, rgba(111, 55, 255, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #1A1E24"
            }}
          >
            {tab === "info" && <Info onTabChange={setTab} />}
            {tab === "deposit" && (
              <Deposit
                onBack={() => {
                  setTab("info");
                }}
              />
            )}
            {tab === "withdraw" && (
              <Withdraw
                onBack={() => {
                  setTab("info");
                }}
              />
            )}
            <div
              className="button absolute top-0 left-[-41px] w-[40px] h-full bg-[#141519CC] border-l border-[#373737] rounded-l-[16px] backdrop-blur-[10px] cursor-pointer"
              onClick={handleToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                className="mt-[24px] ml-[12px]"
              >
                <path
                  d="M1 1L8 9L1 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
