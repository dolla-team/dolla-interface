import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBtcContext } from "../../../context";
import clsx from "clsx";
import MArrowBtn from "./m-arrow-btn";
import ActivePanel from "./active-panel";
import UnactivePanel from "./unactive-panel";
import LastWinner from "@/sections/winners";
import Info from "./info";
// import ShareBtn from "./share-btn";

export default function MobileMarketInfo() {
  const { poolAmount, pool } = useBtcContext();

  const [expand, setExpand] = useState(true);
  return (
    pool && (
      <div className="w-[calc(100%-24px)] mt-[50px] ml-[12px] relative z-[2]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <span
              className="font-[DelaGothicOne] text-[18px]"
              style={{
                WebkitTextStroke: "1px #FFC42F"
              }}
            >
              {poolAmount} BTC Market{" "}
            </span>
            <span
              className={clsx(
                "font-[DelaGothicOne] bg-clip-text text-[18px]",
                "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {" "}
              #{pool?.pool_id}
            </span>
            <MArrowBtn expand={expand} onClick={() => setExpand(!expand)} />
          </div>
          {/* <ShareBtn /> */}
        </div>
        <AnimatePresence>
          {expand && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: pool?.status === 1 ? 102 : 80, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                opacity: { duration: 0.1 }
              }}
            >
              {pool?.status < 2 ? (
                <ActivePanel pool={pool} />
              ) : (
                <UnactivePanel pool={pool} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {pool?.status === 1 ? <LastWinner /> : <Info pool={pool} />}
      </div>
    )
  );
}
