import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import AnimatedCounter from "@/components/animated-counter";
import { motion } from "framer-motion";
import { useBtcContext } from "../../../context";

export default function PreAnimation({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [showCenterArea, setShowCenterArea] = useState(false);
  const { pool, bids } = useBtcContext();

  const duration = bids === 50 ? 8000 : 14000;

  const rewardUsd = Number(pool?.reward_usd || 0);

  useEffect(() => {
    if (!backdropRef.current) {
      return;
    }
    window.howl.prevAnimation.play();
    let timer: NodeJS.Timeout | null = null;
    gsap.timeline().to(backdropRef.current, {
      delay: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        setShowCenterArea(true);
        timer = setTimeout(() => {
          onClose();
          window.howl.prevAnimation.stop();
        }, duration + 500);
      }
    });
    return () => {
      window.howl.bgm.stop();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={backdropRef}
        className="fixed top-0 left-0 w-screen h-screen z-[50] bg-black/60 backdrop-blur-[5px] opacity-0"
      />
      {showCenterArea && (
        <div className="absolute top-0 left-0 w-screen h-screen z-[50] flex flex-col items-center justify-center">
          <img
            src="/btc/winner-coins.gif"
            className="w-[500px] h-[500px] object-cover"
          />
          <div
            style={{
              width: 100 + rewardUsd.toLocaleString().length * 30
            }}
          >
            <AnimatedCounter
              value={rewardUsd}
              decimals={2}
              className="text-[60px] font-[500] bg-gradient-to-b from-[#FFE39C] to-[#FFC42F] bg-clip-text text-transparent"
              prefix="$"
              duration={duration / 1000}
            />
            <div className="text-[20px] text-white font-[500] mt-[10px] w-full text-center">
              Prize Valued
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 z-[60]">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 3, ease: "easeOut" }}
          className="relative w-[440px] h-[440px]"
        >
          <img
            className="w-[348px] h-[386px] object-cover absolute bottom-0 left-[120px] z-[2]"
            src="/btc/pre-left-woman.png"
          />
          <motion.img
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[220px] h-[343px] object-cover absolute top-[-42px] left-[20px]"
            src="/btc/pre-left-woman-arm.png"
          />
        </motion.div>

        <motion.img
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 5, ease: "easeOut" }}
          className="absolute top-[-80px] right-[60px] w-[233px] h-[134px]"
          src="/btc/pre-left-text.png"
        />
      </div>
      <div className="fixed bottom-0 right-[16px] z-[60]">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 3, ease: "easeOut" }}
          className="relative w-[492px] h-[300px]"
        >
          <img
            className="w-[491px] h-[297px] object-cover absolute bottom-0 right-[10px]"
            src="/btc/pre-right-woman.png"
          />
          <motion.img
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[106px] h-[37px] object-cover absolute top-[66px] right-[210px]"
            src="/btc/pre-right-woman-glass.png"
          />
        </motion.div>

        <motion.img
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 6, ease: "easeOut" }}
          className="absolute top-[-80px] right-[60px] w-[196px] h-[120px]"
          src="/btc/pre-right-text.png"
        />
      </div>
    </>
  );
}
