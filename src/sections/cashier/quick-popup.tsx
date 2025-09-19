import Recharge from "./panels/recharge";
import { motion } from "framer-motion";
import { useState, useImperativeHandle, useEffect } from "react";
import config from "@/config/bera";

export default function QuickPopup({ ref }: any) {
  const [showPopup, setShowPopup] = useState(false);
  useImperativeHandle(ref, () => ({
    show: () => {
      console.log("show");
      setShowPopup(true);
    }
  }));
  useEffect(() => {
    const close = () => {
      setShowPopup(false);
    };
    document.addEventListener("click", close);
    return () => {
      document.removeEventListener("click", close);
    };
  }, []);
  return (
    showPopup && (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        exit={{ opacity: 0, y: 100 }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
        }}
        className="absolute top-[50px] left-[50%] translate-x-[-50%] w-[316px] h-[436px] p-[15px] rounded-[6px] bg-[#232932]"
      >
        <div className="text-center text-white font-bold">Recharge</div>
        <Recharge token={config.purchaseToken} />
      </motion.div>
    )
  );
}
