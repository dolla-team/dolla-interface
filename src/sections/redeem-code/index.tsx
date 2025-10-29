import { QUOTE_TOKEN } from "@/config/btc";
import RedeemCodeIcon from "./icon";
import { useState } from "react";
import RedeemModal from "./redeem-modal";

export default function RedeemCode() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="w-[300px] h-[56px] rounded-[10px] border border-black/10 p-[10px] flex items-center justify-between button absolute bottom-[10px] left-[10px]"
      >
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#C2ECDE] flex items-center justify-center">
            <RedeemCodeIcon />
          </div>
          <div>
            <div className="text-[14px] text-black">Redeem Code</div>
            <div className="text-[10px] font-[300] text-[#8A87AA]">
              Using your code to redeem {QUOTE_TOKEN.symbol}
            </div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
        >
          <path
            d="M1 1L8 8L1 15"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <RedeemModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
