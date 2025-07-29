import useIsMobile from "@/hooks/use-is-mobile";
import { useEffect, useState } from "react";
import clsx from "clsx";

const panel_cls = 'bg-[#00000033] rounded-[10px] flex items-center justify-center flex-col py-[10px] text-white text-[16px]'
export default function VerifiForm() {
    const isMobile = useIsMobile();

  return (
    <div>
        <div className="text-[16px] text-[#BBACA6]">Verify</div>
          <div className={clsx("flex gap-[18px] mt-[10px]", isMobile ? "flex-col" : "flex-row items-center")}>
            <input
              className={clsx("flex-1 h-[46px] bg-black/20 rounded-[10px] p-[15px] text-[16px] text-white", isMobile ? "w-full" : "flex-1")}
              placeholder="Enter Market ID"
            />
            <button className={clsx("cursor-pointer h-[36px] rounded-[8px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] text-[16px] text-black", isMobile ? "w-full" : "w-[108px]")}>
              Verify
            </button>
          </div>

          <div className={clsx("grid gap-[12px] mt-[20px] w-full", isMobile ? "grid-cols-2 grid-rows-3" : "grid-cols-3 grid-rows-2")}>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Market No.</div>
              <div>11</div>
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Market Size</div>
              <div>11</div>
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Bid Amount</div>
              <div>11</div>
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Random No.</div>
              <div>11</div>
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Win No.</div>
              <div>11</div>
            </div>
            <div className={panel_cls}>
              <div className="text-[#FFFFFF33]">Settle TX</div>
              <div>11</div>
            </div>
          </div>
    </div>
  );
}