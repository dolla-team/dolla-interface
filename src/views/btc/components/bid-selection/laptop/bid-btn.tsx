import { motion } from "framer-motion";
import clsx from "clsx";
import { useState } from "react";
import BtnBg, { BtnBidBg } from "./btn-bg";

export default function BidBtn({
  disabled,
  flipStatus,
  onClick
}: {
  disabled: boolean;
  flipStatus: number;
  onClick: () => void;
}) {
  return (
    <div className="w-[197px] h-[235px] relative mx-[100px] top-[-56px]">
      <BtnBg />
      <button
        className={clsx(
          "absolute bottom-[-8px] left-0 w-[197px] h-[138px] button",
          disabled && flipStatus !== 4 && "opacity-50"
        )}
        onClick={onClick}
      >
        <div
          className={clsx(
            "relative z-[2] font-bold uppercase mt-[10px]",
            flipStatus === 4 ? "text-[36px]" : "text-[42px]"
          )}
        >
          {flipStatus === 4 ? "AUTO" : "BID"}
        </div>
        <BtnBidBg className="absolute bottom-0 left-0" />
      </button>
    </div>
  );
}
