import { formatNumber } from "@/utils/format/number";
import { useNftContext } from "../context";
import { useMemo } from "react";
import Big from "big.js";

export default function TotalBid() {
  const { pool } = useNftContext();
  const [process] = useMemo(() => {
    if (!pool) return [0];
    const _p = Big(pool?.accumulative_bids || 0)
      .div(pool?.anchor_price || 1)
      .mul(1e18)
      .mul(100)
      .toNumber();

    return [_p];
  }, [pool]);
  return (
    <div className="w-[428px] h-[242px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF99] p-[20px]">
      <div className="flex justify-between items-center text-[14px] text-[#8A87AA]">
        <span>Total Bid</span>
        <span>{process}%</span>
      </div>
      <div className="mt-[90px] h-[12px] w-[368px] mx-auto rounded-[20px] bg-[#FFFFFF99] border border-[#E4E4E4]">
        <div
          className="h-full rounded-[16px] bg-[#8A87AA] relative"
          style={{ width: `${process}%` }}
        >
          <div className="absolute bottom-[16px] right-[-48px] w-[96px] h-[41px] flex items-center justify-center">
            <Bg />
            <span className="text-[#8A87AA] text-[14px] relative z-[2]">
              {formatNumber(pool?.accumulative_bids, 0, true, {
                prefix: "$"
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const Bg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="98"
      height="43"
      viewBox="0 0 98 43"
      fill="none"
      className="absolute top-0 left-0"
    >
      {/* <foreignObject x="-30" y="-30" width="158" height="102.172">
        <div
          style={{
            backdropFilter: "blur(15px)",
            clipPath: "url(#bgblur_0_3488_1750_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject> */}
      <path
        data-figma-bg-blur-radius="30"
        d="M87 0.5C92.799 0.5 97.5 5.20101 97.5 11V27C97.5 32.799 92.799 37.5 87 37.5H54.8281C54.4304 37.5001 54.0488 37.6582 53.7676 37.9395L50.7676 40.9395C49.7913 41.9156 48.2087 41.9156 47.2324 40.9395L44.2324 37.9395C43.9512 37.6582 43.5696 37.5001 43.1719 37.5H11C5.20101 37.5 0.5 32.799 0.5 27V11C0.5 5.20101 5.20101 0.5 11 0.5H87Z"
        stroke="url(#paint0_linear_3488_1750)"
      />
      <defs>
        <clipPath
          id="bgblur_0_3488_1750_clip_path"
          transform="translate(30 30)"
        >
          <path d="M87 0.5C92.799 0.5 97.5 5.20101 97.5 11V27C97.5 32.799 92.799 37.5 87 37.5H54.8281C54.4304 37.5001 54.0488 37.6582 53.7676 37.9395L50.7676 40.9395C49.7913 41.9156 48.2087 41.9156 47.2324 40.9395L44.2324 37.9395C43.9512 37.6582 43.5696 37.5001 43.1719 37.5H11C5.20101 37.5 0.5 32.799 0.5 27V11C0.5 5.20101 5.20101 0.5 11 0.5H87Z" />
        </clipPath>
        <linearGradient
          id="paint0_linear_3488_1750"
          x1="49"
          y1="1"
          x2="49"
          y2="37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E4E4E4" />
          <stop offset="1" stopColor="#E4E4E4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
