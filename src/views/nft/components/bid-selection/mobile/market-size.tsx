import { formatNumber } from "@/utils/format/number";
import { useBtcContext } from "@/views/btc/context";
import clsx from "clsx";
import { getAnchorPrice } from "@/utils/pool";

export default function MarketSize({
  hasBg = true,
  className
}: {
  hasBg?: boolean;
  className?: string;
}) {
  const { pool, poolAmount } = useBtcContext();
  return (
    <div
      className={clsx(
        "relative w-full h-[95px] mt-[12px] ml-[12px] text-center",
        className
      )}
    >
      {hasBg && (
        <div className="w-[calc(100%-36px)] h-[95px] absolute top-0 left-[6px]">
          <Bg />
        </div>
      )}

      <div className="relative z-[2] font-[DelaGothicOne]">
        <div
          className="text-[42px] text-transparent bg-clip-text bg-[radial-gradient(50%_50%_at_50%_50%,#FFF_0%,#C4C4FF_100%)]"
          style={{
            textShadow: "0 0 20px #6A48FF",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          ${formatNumber(getAnchorPrice(pool?.anchor_price), 0, true)}
        </div>
        <div className="flex items-center justify-center gap-[6px] mt-[-8px]">
          <span
            className="text-[16px] bg-clip-text text-transparent"
            style={{
              WebkitTextStroke: "1px #7C68FF"
            }}
          >
            1 DOLLA FOR
          </span>
          <span className="text-[16px] bg-gradient-to-b from-[#FFF698] to-[#FFC42F] bg-clip-text text-transparent">
            {poolAmount} BTC
          </span>
        </div>
      </div>
    </div>
  );
}

const Bg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="95"
      viewBox="0 0 357 95"
      fill="none"
      preserveAspectRatio="none"
    >
      <foreignObject x="-49.7898" y="-50" width="456.58" height="195">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_2370_999_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <path
        // @ts-ignore
        dataFigmaBgBlurRadius="50"
        d="M314.099 0.5C319.093 0.500085 323.608 3.47351 325.581 8.06152L355.259 77.0615C358.807 85.3116 352.756 94.5 343.775 94.5H13.2246C4.24383 94.5 -1.80691 85.3116 1.74121 77.0615L31.4189 8.06152C33.3923 3.47351 37.907 0.500089 42.9014 0.5H314.099Z"
        fill="url(#paint0_radial_2370_999)"
        stroke="#7C68FF"
      />
      <defs>
        <clipPath
          id="bgblur_0_2370_999_clip_path"
          transform="translate(49.7898 50)"
        >
          <path d="M314.099 0.5C319.093 0.500085 323.608 3.47351 325.581 8.06152L355.259 77.0615C358.807 85.3116 352.756 94.5 343.775 94.5H13.2246C4.24383 94.5 -1.80691 85.3116 1.74121 77.0615L31.4189 8.06152C33.3923 3.47351 37.907 0.500089 42.9014 0.5H314.099Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_2370_999"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(178.5 47.5) scale(183.5 46.5)"
        >
          <stop stopColor="#7C68FF" />
          <stop offset="1" />
        </radialGradient>
      </defs>
    </svg>
  );
};
