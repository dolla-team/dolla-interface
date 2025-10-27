import { formatNumber } from "@/utils/format/number";
import dayjs from "@/libs/dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BridgeResultItem({ data }: { data: any }) {
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // Start progress animation when component mounts
    const timer = setTimeout(() => {
      setProgressWidth(80);
    }, 100); // Small delay to ensure component is mounted

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // When status becomes SUCCESS, animate to 100%
    if (data.status === "SUCCESS") {
      const timer = setTimeout(() => {
        setProgressWidth(100);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data.status]);

  return (
    <motion.div
      className="w-[300px] h-[65px] bg-[#00000008] rounded-[10px] px-[8px] pt-[8px]"
      initial={{ x: 0, opacity: 1 }}
      exit={{
        x: "100%",
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
    >
      <div className="flex items-center gap-[14px]">
        <div>
          <span className="text-[14px] text-black">
            {formatNumber(
              data.inputCurrencyAmount,
              data.inputCurrency.isBaseToken ? 6 : 2,
              true
            )}{" "}
          </span>
          <span className="text-[12px] text-[#8A87AA]">
            {data.inputCurrency.symbol}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="9"
          viewBox="0 0 20 9"
          fill="none"
        >
          <path
            d="M0.600098 3.81846C0.268727 3.81846 9.76324e-05 4.08709 9.76324e-05 4.41846C9.76324e-05 4.74983 0.268727 5.01846 0.600098 5.01846V4.41846V3.81846ZM19.0244 4.84272C19.2587 4.60841 19.2587 4.22851 19.0244 3.99419L15.206 0.175816C14.9717 -0.0584984 14.5918 -0.0584984 14.3575 0.175816C14.1231 0.410131 14.1231 0.79003 14.3575 1.02434L17.7516 4.41846L14.3575 7.81257C14.1231 8.04688 14.1231 8.42678 14.3575 8.6611C14.5918 8.89541 14.9717 8.89541 15.206 8.6611L19.0244 4.84272ZM0.600098 4.41846V5.01846H18.6001V4.41846V3.81846H0.600098V4.41846Z"
            fill="black"
          />
        </svg>
        <div>
          <span className="text-[14px] text-black">
            {formatNumber(
              data.outputCurrencyAmount,
              data.outputCurrency.isBaseToken ? 6 : 2,
              true
            )}{" "}
          </span>
          <span className="text-[12px] text-[#8A87AA]">
            {data.outputCurrency.symbol}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-[6px]">
        <div className="flex items-center gap-[4px]">
          <button className="p-[2px] button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path d="M4.5 1.5H0.5V9.5H8.5V5.5" stroke="#9FA7BA" />
              <path
                d="M3.5 6.5L9.5 0.5M9.5 0.5H6M9.5 0.5V3.5"
                stroke="#9FA7BA"
              />
            </svg>
          </button>
          <span className="text-[10px] text-[#8A87AA]">
            {dayjs(data.time).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
        <div className="flex items-center gap-[4px]">
          {data.status === "SUCCESS" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="8"
                viewBox="0 0 11 8"
                fill="none"
              >
                <path
                  d="M0.75 3.15004L4.28571 6.75L9.75 0.75"
                  stroke="#27C627"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] text-[#27C627]">Completed</span>
            </>
          ) : (
            <span className="text-[10px] text-[#0088FF]">Pending</span>
          )}
        </div>
      </div>
      <div className="h-[3px] w-full bg-[#00000008] rounded-[3px] mt-[4px] overflow-hidden">
        <motion.div
          className="h-full bg-[#27C627] rounded-[3px]"
          initial={{ width: "0%" }}
          animate={{ width: `${progressWidth}%` }}
          transition={{
            duration: progressWidth === 80 ? 3 : 0.5, // 3 seconds for 0->80%, 0.5 seconds for 80%->100%
            ease: "easeOut"
          }}
        />
      </div>
    </motion.div>
  );
}
