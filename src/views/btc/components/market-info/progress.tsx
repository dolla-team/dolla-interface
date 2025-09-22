import useIsMobile from "@/hooks/use-is-mobile";
import { formatNumber } from "@/utils/format/number";
import { getAnchorPrice } from "@/utils/pool";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function Progress({ data }: any) {
  const progress = useMemo(() => {
    if (!data) return 0;
    if (!data?.accumulative_bids || data?.anchor_price === "0") return 0;

    const anchorPrice = getAnchorPrice(data?.anchor_price);
    if (anchorPrice === 0) return 0;
    return (data.accumulative_bids / anchorPrice) * 100;
  }, [data]);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const size = Math.random() * 2 + 1;
        const delay = Math.random() * 0.3;
        const duration = Math.random() * 0.6 + 0.4;
        const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
        const distance = 30 + Math.random() * 20;
        const x = -Math.abs(Math.cos(angle) * distance);
        const y = Math.sin(angle) * distance;
        const top = Math.random() * 12 - 6;

        return {
          id: i,
          size,
          delay,
          duration,
          angle,
          distance,
          x,
          y,
          top,
          left: i * 2
        };
      }),
    []
  );

  return (
    <div
      className={clsx(
        "w-full h-[12px] rounded-[30px] border bg-[#FFFFFF1A]",
        data?.status === 3 ? "border-[#4E4E4E]" : "border-[#757395]"
      )}
    >
      <div className="h-[10px] rounded-[10px] p-[1px]">
        <div
          className={clsx(
            "rounded-[10px] h-[8px] border relative",
            data?.status === 3
              ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)] border-[#4E4E4E]"
              : "bg-[linear-gradient(90deg,#A2623D_0%,#FFC42F_47.6%,#FFE9B2_100%)] border-[#4E4E4E]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress >= 80 && progress < 100 && data?.status !== 3 && (
            <div className="absolute top-0 right-[-35px] w-[50px] h-[50px] flex items-center justify-center pointer-events-none">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute bg-[#FFE9B2] rounded-full"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    left: `${particle.left}px`,
                    top: `${particle.top}px`
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.3],
                    x: [0, particle.x],
                    y: [0, particle.y]
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    repeatDelay: 0.1,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
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
  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        "absolute  p-[4px] h-[24px] leading-[14px] text-[14px] text-center font-[DelaGothicOne] rounded-[6px]",
        !disabled
          ? "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)] border-[#4E4E4E]"
          : "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]",
        isMobile ? "top-[12px]" : "top-[16px] right-[-20px]"
      )}
    >
      ${formatNumber(amount, 2, true)}
    </div>
  );
};
