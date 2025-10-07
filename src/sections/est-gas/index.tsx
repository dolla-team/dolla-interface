import axiosInstance from "@/libs/axios";
import EstGasIcon from "./est-gas-icon";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { formatNumber } from "@/utils/format/number";

export default function EstGas({ className }: any) {
  const [gas, setGas] = useState<any>(null);

  useEffect(() => {
    const fetchGas = async () => {
      const gas = await axiosInstance.get("/api/v1/gas");
      setGas(gas.data.data);
    };
    fetchGas();
  }, []);

  return (
    <div className="relative group">
      <div
        className={clsx(
          "flex justify-center items-center gap-[6px] button w-[118px] h-[36px] bg-[#FFFFFF80] border border-[#E4E4E4] rounded-[10px]",
          className
        )}
      >
        <EstGasIcon />
        <span className="text-[12px] text-[#8A87AA]">Est. Gas</span>
      </div>
      <div className="w-[288px] rounded-[10px] bg-[#2D2B35] border border-[#514A5D] leading-[2] absolute z-10 left-[-90px] top-[40px] text-white text-[12px] invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-[10px] px-[16px]">
        <div className="flex items-center justify-between">
          <span>Bid</span>
          <span>
            ~ ${formatNumber(gas?.bid.min_usd, 3, true)} - $
            {formatNumber(gas?.bid.max_usd, 3, true)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Market Creation</span>
          <span>
            ~ ${formatNumber(gas?.market_creation.min_usd, 3, true)} - $
            {formatNumber(gas?.market_creation.max_usd, 3, true)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Withdraw</span>
          <span>
            ~ ${formatNumber(gas?.withdraw.min_usd, 3, true)} - $
            {formatNumber(gas?.withdraw.max_usd, 3, true)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Claim</span>
          <span>
            ~ ${formatNumber(gas?.claim.min_usd, 3, true)} - $
            {formatNumber(gas?.claim.max_usd, 3, true)}
          </span>
        </div>
      </div>
    </div>
  );
}
