import axiosInstance from "@/libs/axios";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function EstGas({ className }: any) {
  const [gas, setGas] = useState<any>(null);

  useEffect(() => {
    const fetchGas = async () => {
      const gas = await axiosInstance.get('/api/v1/gas');
      setGas(gas.data.data);
    }
    fetchGas();
  }, [])

  return (
    <div className="relative group">
      <div className={clsx("flex items-center gap-[6px] button", className)}>
        <img src="/est-gas.gif" className="w-[24px] h-[24px]" />
        <span className="text-[14px] text-[#FFE9B2]">Est. Gas</span>
      </div>
      <div className="w-[288px] rounded-[10px] bg-[#35302B] border border-[#6A5D3A] leading-[2] absolute left-[-18px] top-[40px] text-[#FFE9B2] text-[14px] invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-[10px] px-[16px]">
        <div className="flex items-center justify-between">
          <span>Bid</span>
          <span>~ ${gas?.bid.min} - ${gas?.bid.max}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Market Creation</span>
          <span>~ ${gas?.market_creation.min} - ${gas?.market_creation.max}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Withdraw</span>
          <span>~ ${gas?.withdraw.min} - ${gas?.withdraw.max}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Claim</span>
          <span>~ ${gas?.claim.min} - ${gas?.claim.max}</span>
        </div>
      </div>
    </div>
  );
}
