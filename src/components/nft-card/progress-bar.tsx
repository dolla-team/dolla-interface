import clsx from "clsx";
import { motion } from "framer-motion";
import { formatNumber } from "@/utils/format/number";

export default function ProgressBar({
  type,
  progress,
  className,
  bids
}: {
  type: string;
  progress: number;
  className?: string;
  bids?: number;
}) {
  return (
    <div
      className={clsx(
        "rounded-[12px] relative h-[10px] border border-[#3B3951] bg-[#FFFFFF1A] backdrop-blur-[10px]",
        className
      )}
    >
      <div
        className="h-full absolute left-0 top-0 rounded-[12px] shadow-[0px_0px_6px_0px_#FFC42F]"
        style={{
          background:
            progress >= 100
              ? "linear-gradient(270deg, #FFC42F 0%, #FF43E0 54.81%, #53EABF 100%)"
              : type !== "basic"
              ? "linear-gradient(90deg, #A2623D 0%, #FFC42F 50%, #FFE9B2 100%)"
              : "linear-gradient(90deg, #6F37FF 0%, #00FFBB 100%)",
          width: `${Math.min(progress, 100)}%`
        }}
      >
        {progress >= 80 && progress < 100 && (
          <>
            <motion.div
              className={clsx(
                "absolute right-0 top-[-3px] w-[4px] h-[2px] rounded-full rotate-45",
                type === "basic" ? "bg-[#00FFBB]" : "bg-[#FFC42F]"
              )}
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
              className={clsx(
                "absolute right-0 bottom-[-3px] w-[4px] h-[2px] rounded-full rotate-[-45deg]",
                type === "basic" ? "bg-[#00FFBB]" : "bg-[#FFC42F]"
              )}
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
        {!!bids && (
          <div className="absolute px-[6px] top-[14px] right-[-20px] rounded-[6px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] font-[DelaGothicOne]">
            {formatNumber(bids, 2, true, { isShort: true, prefix: "$" })}
          </div>
        )}
      </div>
    </div>
  );
}
