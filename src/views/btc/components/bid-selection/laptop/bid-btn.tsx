import clsx from "clsx";
import { useBtcContext } from "@/views/btc/context";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BidBtn({
  disabled,
  bids,
  balanceNotEnough,
  probability,
  onClick
}: {
  disabled: boolean;
  bids: number;
  balanceNotEnough: boolean;
  probability: string;
  onClick: () => void;
}) {
  const { flipStatus, setFlipStatus } = useBtcContext();
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (flipStatus !== 4) {
      clearTimeout(window.autoFlipTimer);
      setCount(10);
      return;
    }
    if (count === 0) {
      clearTimeout(window.autoFlipTimer);
      setFlipStatus(5);
      return;
    }
    if (count > 0) {
      window.autoFlipTimer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    }
  }, [count, flipStatus]);
  return (
    <div
      className={clsx(
        "w-[300px] h-[96px] p-[8px] relative mt-[60px] shrink-0 rounded-[24px] border border-black bg-[#333333]",
        "shadow-[0px_7px_0px_0px_rgba(255,255,255,0.60)_inset]"
      )}
    >
      <div
        className={clsx("h-full rounded-[20px] border border-black relative")}
        style={{
          background:
            flipStatus !== 4 && flipStatus !== 5
              ? "radial-gradient(50% 50% at 50% 50%, #FFB700 0%, #FFD876 100%)"
              : "radial-gradient(50% 50% at 50% 50%, #00FF95 0%, #00FF59 100%)",
          boxShadow:
            flipStatus !== 4 && flipStatus !== 5
              ? "0 7px 0 0 rgba(255, 255, 255, 0.60) inset, 0 0 10px 0 rgba(255, 210, 87, 0.50)"
              : "0 7px 0 0 rgba(255, 255, 255, 0.60) inset, 0 0 20px 0 #01FF6F"
        }}
      >
        {/* Halo glow only when button is NOT disabled */}
        {!disabled && (
          <motion.div
            className={clsx(
              "absolute -inset-2 rounded-[28px] pointer-events-none z-[1]"
            )}
            // Loop opacity from 0% -> 100% -> 0%
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              // Radial glow with soft blur; does not block clicks due to pointer-events-none
              background:
                // White-ish halo
                "radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, 0.7) 60%, rgba(255, 255, 255, 0.0) 100%)",
              filter: "blur(12px)"
            }}
          />
        )}
        <button
          className={clsx("w-full h-full relative z-[2]", "button")}
          id="tips-bid-button"
          onClick={onClick}
        >
          {disabled && flipStatus !== 4 && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-[20px]" />
          )}
          {flipStatus === 4 && window.autoFlipTimer !== -1 ? (
            <div className="text-[26px] font-bold">Auto Open {count}s</div>
          ) : flipStatus === 5 ? (
            <div className="text-[26px] font-bold">Openning</div>
          ) : (
            <div
              className={clsx(
                "font-bold",
                flipStatus === 4
                  ? window.autoFlipTimer !== -1
                    ? "text-[20px]"
                    : "text-[36px]"
                  : balanceNotEnough
                  ? "text-[18px]"
                  : "text-[42px]"
              )}
            >
              {flipStatus === 4
                ? "AUTO"
                : balanceNotEnough
                ? "Insufficient Balance"
                : "BID"}
            </div>
          )}
        </button>
      </div>
      <div className="text-[#FFC42F] text-[12px] text-center mt-[16px]">
        Dolla Probability{" "}
        <span className="font-[500]">
          {bids} Bid = {probability}%
        </span>
      </div>
    </div>
  );
}
