import { formatNumber } from "@/utils/format/number";
import { getAnchorPrice } from "@/utils/pool";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function Progress({ data }: any) {
  const progress = useMemo(() => {
    if (!data) return 0;
    if (!data?.accumulative_bids || data?.anchor_price === "0") return 0;

    return (data.accumulative_bids / getAnchorPrice(data)) * 100;
  }, [data]);

  return (
    <div
      className={clsx(
        "w-full h-[12px] rounded-[30px] border bg-[#FFFFFF1A]",
        data?.status === 3 ? "border-[#4E4E4E]" : "border-[#FFE9B2]"
      )}
    >
      <div className="h-[10px] rounded-[10px] p-[1px]">
        <div
          className={clsx(
            "rounded-[10px] h-[8px] border relative",
            data?.status === 3
              ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)] border-[#4E4E4E]"
              : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)] border-[#FFE9B2]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress >= 80 && progress < 100 && data?.status !== 3 && (
            <>
              <motion.div
                className="absolute right-0 top-[-3px] w-[4px] h-[2px] bg-[#FFC42F] rounded-full rotate-45"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: [-2, -16, -2],
                  opacity: [1, 0.6, 1]
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />
              <motion.div
                className="absolute right-0 bottom-[-3px] w-[4px] h-[2px] bg-[#FFC42F] rounded-full rotate-[-45deg]"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: [-2, -16, -2],
                  opacity: [0.6, 0.4, 0.6]
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              ></motion.div>
            </>
          )}
          <Label
            amount={data?.accumulative_bids || 0}
            disabled={data?.status === 3}
          />
        </div>
      </div>
    </div>
  );
}

const Label = ({ amount, disabled }: { amount: number; disabled: boolean }) => {
  return (
    <div
      className="absolute top-[10px] right-[-45px] w-[90px] h-[42px]"
      style={{
        transform: "rotate(-20deg)",
        right: "-54px"
      }}
    >
      <span className="absolute top-[18px] left-[0px] w-full z-[2] text-[#3E2B2B] text-center  font-['DelaGothicOne'] text-[14px]  leading-[14px] rotate-[-5deg]">
        ${formatNumber(amount, 2, true)}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="92"
        height="46"
        viewBox="0 0 92 46"
        fill="none"
        className="absolute top-0 left-0"
      >
        <mask id="path-1-inside-1_1532_20519" fill="white">
          <path d="M84.1723 38.6947C88.5737 38.3097 91.8297 34.4295 91.4448 30.0282L89.8631 11.9519C89.478 7.55055 85.598 4.29443 81.1966 4.67944L50.464 7.36885L46.0304 1.03435C45.5889 0.403874 44.6299 0.487405 44.3044 1.18476L41.0366 8.19363L7.99329 11.0845C3.59183 11.4696 0.335789 15.3496 0.720862 19.751L2.30238 37.8264C2.68746 42.2278 6.56747 45.4838 10.9689 45.0988L84.1723 38.6947Z" />
        </mask>
        <path
          d="M84.1723 38.6947C88.5737 38.3097 91.8297 34.4295 91.4448 30.0282L89.8631 11.9519C89.478 7.55055 85.598 4.29443 81.1966 4.67944L50.464 7.36885L46.0304 1.03435C45.5889 0.403874 44.6299 0.487405 44.3044 1.18476L41.0366 8.19363L7.99329 11.0845C3.59183 11.4696 0.335789 15.3496 0.720862 19.751L2.30238 37.8264C2.68746 42.2278 6.56747 45.4838 10.9689 45.0988L84.1723 38.6947Z"
          fill={disabled ? "#AFAFAF" : "#FFC42F"}
        />
        <path
          d="M84.1723 38.6947L84.2595 39.6909L84.2595 39.6909L84.1723 38.6947ZM91.4448 30.0282L92.441 29.941L92.441 29.9411L91.4448 30.0282ZM89.8631 11.9519L90.8593 11.8647L90.8593 11.8647L89.8631 11.9519ZM81.1966 4.67944L81.1095 3.68325L81.1095 3.68324L81.1966 4.67944ZM50.464 7.36885L50.5512 8.36505L49.9759 8.41539L49.6447 7.94227L50.464 7.36885ZM46.0304 1.03435L46.8495 0.460777L46.8496 0.460935L46.0304 1.03435ZM44.3044 1.18476L43.398 0.762196L43.3982 0.761811L44.3044 1.18476ZM41.0366 8.19363L41.943 8.61619L41.699 9.1395L41.1238 9.18983L41.0366 8.19363ZM7.99329 11.0845L7.90613 10.0883L7.90614 10.0883L7.99329 11.0845ZM0.720862 19.751L-0.275331 19.8382L-0.275332 19.8382L0.720862 19.751ZM2.30238 37.8264L3.29858 37.7392L3.29858 37.7392L2.30238 37.8264ZM10.9689 45.0988L11.0561 46.095L11.056 46.095L10.9689 45.0988ZM84.1723 38.6947L84.0852 37.6985C87.9364 37.3616 90.7853 33.9665 90.4486 30.1153L91.4448 30.0282L92.441 29.9411C92.874 34.8926 89.211 39.2577 84.2595 39.6909L84.1723 38.6947ZM91.4448 30.0282L90.4486 30.1154L88.867 12.039L89.8631 11.9519L90.8593 11.8647L92.441 29.941L91.4448 30.0282ZM89.8631 11.9519L88.867 12.039C88.5299 8.18782 85.1349 5.33876 81.2838 5.67563L81.1966 4.67944L81.1095 3.68324C86.0611 3.2501 90.426 6.91328 90.8593 11.8647L89.8631 11.9519ZM81.1966 4.67944L81.2838 5.67563L50.5512 8.36505L50.464 7.36885L50.3768 6.37266L81.1095 3.68325L81.1966 4.67944ZM50.464 7.36885L49.6447 7.94227L45.2111 1.60777L46.0304 1.03435L46.8496 0.460935L51.2832 6.79544L50.464 7.36885ZM46.0304 1.03435L45.2112 1.60793L45.2105 1.6077L44.3044 1.18476L43.3982 0.761811C44.0494 -0.633382 45.9669 -0.799767 46.8495 0.460777L46.0304 1.03435ZM44.3044 1.18476L45.2107 1.60732L41.943 8.61619L41.0366 8.19363L40.1303 7.77107L43.398 0.762196L44.3044 1.18476ZM41.0366 8.19363L41.1238 9.18983L8.08044 12.0807L7.99329 11.0845L7.90614 10.0883L40.9495 7.19744L41.0366 8.19363ZM7.99329 11.0845L8.08045 12.0807C4.22911 12.4176 1.38012 15.8127 1.71706 19.6639L0.720862 19.751L-0.275332 19.8382C-0.708545 14.8865 2.95455 10.5215 7.90613 10.0883L7.99329 11.0845ZM0.720862 19.751L1.71706 19.6639L3.29858 37.7392L2.30238 37.8264L1.30619 37.9136L-0.275331 19.8382L0.720862 19.751ZM2.30238 37.8264L3.29858 37.7392C3.63552 41.5905 7.03056 44.4395 10.8818 44.1026L10.9689 45.0988L11.056 46.095C6.10439 46.5282 1.73939 42.8651 1.30619 37.9135L2.30238 37.8264ZM10.9689 45.0988L10.8817 44.1026L84.0852 37.6985L84.1723 38.6947L84.2595 39.6909L11.0561 46.095L10.9689 45.0988Z"
          fill="url(#paint0_linear_1532_20519)"
          mask="url(#path-1-inside-1_1532_20519)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1532_20519"
            x1="48.1935"
            y1="46.5734"
            x2="43.2833"
            y2="-3.85286"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={disabled ? "#E5E5E5" : "#FFF9B8"} />
            <stop offset="1" stopColor={disabled ? "#565656" : "#99956E"} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
