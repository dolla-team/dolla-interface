import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function ProgressBar({
  progress,
  spilled,
  spilledPercent
}: {
  progress: number;
  spilled: number;
  spilledPercent: number;
}) {
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
    <div className="relative">
      <div
        className={clsx(
          "h-[10px] rounded-[30px] bg-[#0000001A] absolute top-0 left-0 z-[1]"
        )}
        style={{
          width: spilled > 0 ? 100 - spilledPercent! + "%" : "100%"
        }}
      />
      <div className="h-[6px] rounded-[10px] relative top-[2px] left-[2px] z-[2]">
        <div
          className={clsx(
            "rounded-[10px] h-[6px] relative",
            "bg-[linear-gradient(to_right,#FFE9B2_0%,#FFC42F_47.6%,#F88E51_100%)]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress > 0 && (
            <div className="absolute top-0 right-[-35px] w-[50px] h-[50px] flex items-center justify-center pointer-events-none">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute bg-[#FFC42F] rounded-full"
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
        </div>
      </div>
      {spilled > 0 && (
        <>
          <div
            style={{ width: spilledPercent! + "%" }}
            className="absolute top-[3px] right-[-1px] z-[3] h-[4px] bg-linear-to-r from-[#C637FF] to-[#FFADCF] rounded-r-[4px]"
          />
        </>
      )}
    </div>
  );
}
