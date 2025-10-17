import clsx from "clsx";
import { useBtcContext } from "@/views/btc/context";
import { useState, useEffect } from "react";

export default function BidBtn({
  disabled,
  onClick
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  const { flipStatus, setFlipStatus, bids } = useBtcContext();
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
        "w-[300px] h-[96px] p-[8px] relative mt-[80px] shrink-0 rounded-[24px] border border-black bg-[#333333]",
        "shadow-[0px_7px_0px_0px_rgba(255,255,255,0.60)_inset]"
      )}
    >
      <div
        className={clsx("h-full rounded-[20px] border border-black")}
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
        <button
          className={clsx("w-full h-full relative", "button")}
          id="tips-bid-button"
          onClick={onClick}
        >
          {disabled && flipStatus !== 4 && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
          )}
          {flipStatus === 4 && window.autoFlipTimer !== -1 ? (
            <div className="text-[26px] font-bold">Auto Open {count}s</div>
          ) : flipStatus === 5 ? (
            <div className="text-[26px] font-bold">Openning</div>
          ) : (
            <div
              className={clsx(
                "font-bold uppercase",
                flipStatus === 4
                  ? window.autoFlipTimer !== -1
                    ? "text-[20px]"
                    : "text-[36px]"
                  : "text-[42px]"
              )}
            >
              {flipStatus === 4 ? "AUTO" : "BID"}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
