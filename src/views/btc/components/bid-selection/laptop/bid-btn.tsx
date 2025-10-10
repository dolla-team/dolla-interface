import clsx from "clsx";
import BtnBg, { BtnBidBg } from "./btn-bg";
import { useBtcContext } from "@/views/btc/context";
import { useState, useEffect, useRef } from "react";

export default function BidBtn({
  disabled,
  onClick
}: {
  disabled: boolean;
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
    <div className="w-[197px] h-[235px] relative top-[-56px] shrink-0">
      <BtnBg />
      <button
        className={clsx(
          "absolute bottom-[-8px] left-0 w-[197px] h-[138px]",
          disabled && flipStatus !== 4 ? "opacity-50" : "button"
        )}
        onClick={onClick}
      >
        {flipStatus === 4 && window.autoFlipTimer !== -1 && (
          <div className="relative z-[2] text-[36px] font-bold">{count}S</div>
        )}
        <div
          className={clsx(
            "relative z-[2] font-bold uppercase",
            flipStatus === 4
              ? window.autoFlipTimer !== -1
                ? "text-[20px] mt-[-14px]"
                : "text-[36px]"
              : "text-[42px] mt-[10px]"
          )}
        >
          {flipStatus === 4 ? "AUTO" : "BID"}
        </div>
        {/* {disabled && flipStatus !== 4 ? (
          <DollaEye
            className="w-[50px] h-[50px] absolute left-[76px] bottom-[40px]"
            onlyEye
          />
        ) : (
          <div
            className={clsx(
              "relative z-[2] font-bold uppercase mt-[10px]",
              flipStatus === 4 ? "text-[36px]" : "text-[42px]"
            )}
          >
            {flipStatus === 4 ? "AUTO" : "BID"}
          </div>
        )} */}
        <BtnBidBg
          className="absolute bottom-0 left-0"
          isAuto={flipStatus === 4}
          isAnimation={flipStatus === 0 && !disabled}
        />
      </button>
    </div>
  );
}
