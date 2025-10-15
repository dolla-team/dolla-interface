import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function ProgressBar({
  progress,
  spilled,
  spilledPercent,
  status
}: {
  progress: number;
  spilled: number;
  spilledPercent: number;
  status: string;
}) {
  return (
    <div
      className={clsx(
        "relative flex items-center w-[220px]",
        Number(status) !== 1 && "grayscale"
      )}
    >
      <div
        className={clsx(
          "h-[10px] w-[110px] rounded-[30px] bg-[#0000001A] p-[2px]"
        )}
      >
        <div
          className={clsx(
            "rounded-[10px] h-[6px] relative",
            "bg-[linear-gradient(to_right,#FFE9B2_0%,#FFC42F_47.6%,#F88E51_100%)]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress > 0 && spilled <= 0 && Number(status) === 1 && (
            <Particles />
          )}
        </div>
      </div>
      {spilled > 0 && (
        <>
          <div
            style={{ width: Math.min(spilledPercent!, 100) * 1.1 + "px" }}
            className="absolute top-[2px] left-[110px] z-[3] h-[6px] rounded-[10px] bg-linear-to-r from-[#C637FF] to-[#FFADCF]"
          >
            {Number(status) === 1 && <Particles />}
          </div>
        </>
      )}
    </div>
  );
}

const Particles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const size = Math.random() * 2 + 1;
        const delay = Math.random() * 0.3;
        const duration = Math.random() * 0.6 + 0.2;
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
            scale: [0, 1.5, 0.6],
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
  );
};
