import { motion } from "framer-motion";

export default function FlipAvater() {
  return (
    <div className="mx-auto mt-[20px] w-[56px] h-[56px]">
      <motion.div
        className="relative w-full h-full p-[1px] bg-linear-to-b from-[#DD9000] via-[#FFBF47] to-[#774E00] rounded-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Front side */}
        <div className="absolute inset-[1px] w-[54px] h-[54px] rounded-full bg-[#22212E] text-[18px] text-[#8A87AA] font-[700] leading-[54px] text-center">
          ?
        </div>
        {/* Back side */}
        <div
          style={{ transform: "rotateY(180deg)" }}
          className="absolute inset-[1px] backface-hidden w-[54px] h-[54px] rounded-full bg-[#22212E] text-[18px] text-[#8A87AA] font-[700] leading-[54px] text-center"
        >
          ?
        </div>
      </motion.div>
    </div>
  );
}
