import BridgeResultItem from "./item";
import { useHistoryStore } from "@/stores/use-swap-history";
import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function BridgeResult() {
  const historyStore = useHistoryStore();
  const [showMore, setShowMore] = useState(false);

  const list = useMemo(() => {
    const pendingStatus = historyStore.pendingStatus;
    // If showMore is false, only show first 2 items
    return showMore ? pendingStatus : pendingStatus.slice(0, 2);
  }, [historyStore.pendingStatus.length, showMore]);

  return (
    <div className="absolute bottom-[10px] w-full">
      <AnimatePresence mode="popLayout">
        {list.map((item: any) => (
          <BridgeResultItem key={item} data={historyStore.history[item]} />
        ))}
      </AnimatePresence>
      {historyStore.pendingStatus.length > 2 && (
        <div
          className="flex items-center justify-center button gap-[4px] mt-[10px] cursor-pointer"
          onClick={() => setShowMore(!showMore)}
        >
          <span className="text-[12px] text-[#8A87AA]">
            {showMore ? "less" : "more"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            className={`transition-transform ${showMore ? "rotate-180" : ""}`}
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="#8A87AA"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
