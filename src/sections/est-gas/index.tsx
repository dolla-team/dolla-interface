import axiosInstance from "@/libs/axios";
import EstGasIcon from "./est-gas-icon";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";

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
      <div className="w-[280px] rounded-[10px] bg-[#FFFFFF] border border-[#E4E4E4] shadow-[0_0_6px_0_rgba(0,0,0,0.10)] leading-[2] absolute z-10 left-[-90px] top-[40px] text-[#8A87AA] text-[12px] font-[500] invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-[10px] px-[16px]">
        <div className="flex items-center justify-between py-[2px]">
          <span>Bid</span>
          <div className="flex items-center gap-[4px]">
            <span>
              ~{" "}
              {formatNumber(
                Big(gas?.bid?.min_usd || 0)
                  .add(Big(gas?.bid?.max_usd || 0))
                  .div(2),
                3,
                true
              )}
            </span>
            <img className="w-[16px] h-[16px]" src={QUOTE_TOKEN.icon} />
          </div>
        </div>
        <div className="flex items-center justify-between py-[2px]">
          <span>Market Creation</span>
          <div className="flex items-center gap-[4px]">
            <span>
              ~ 0.0<span className="text-[8px] mt-[4px]">6</span>5
            </span>
            <img className="w-[16px] h-[16px]" src={BASE_TOKEN.icon} />
          </div>
        </div>
        <div className="flex items-center justify-between py-[2px]">
          <span>Withdraw</span>
          <div className="flex items-center gap-[4px]">
            <span>
              ~{" "}
              {formatNumber(
                Big(gas?.withdraw?.min_usd || 0)
                  .add(Big(gas?.withdraw?.max_usd || 0))
                  .div(2),
                3,
                true
              )}
            </span>
            <img className="w-[16px] h-[16px]" src={QUOTE_TOKEN.icon} />
          </div>
        </div>
        <div className="flex items-center justify-between py-[2px]">
          <span>Claim</span>
          <div className="flex items-center gap-[4px]">
            <span>
              ~{" "}
              {formatNumber(
                Big(gas?.claim?.min_usd || 0)
                  .add(Big(gas?.claim?.max_usd || 0))
                  .div(2),
                3,
                true
              )}
            </span>
            <img className="w-[16px] h-[16px]" src={QUOTE_TOKEN.icon} />
          </div>
        </div>
      </div>
    </div>
  );
}
