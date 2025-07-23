import Item from "./item";
import { AnimatePresence, motion } from "framer-motion";
import useBidList from "./use-bid-list";
import { useDebounceFn } from "ahooks";
import { useMemo, useRef, useState } from "react";
import { useBtcContext } from "../../context";

export default function BidsInfoWrapper() {
  const [refresher, setRefresher] = useState(0);
  const { pool } = useBtcContext();
  return (
    pool?.status === 1 && (
      <BidsInfoInner
        onRefresher={() => {
          setRefresher(refresher + 1);
        }}
      />
    )
  );
}

function BidsInfoInner({ onRefresher }: any) {
  const { list, show, hasNext } = useBidList();

  const containerRef = useRef<any>(null);

  const [animationY, duration] = useMemo(() => {
    if (!list.length) return [0, 10];
    const _cy = containerRef.current?.clientHeight || list.length * 36;
    const _y = hasNext ? _cy : _cy + 360;
    const _cd = _y / 360 < 2 ? 10 : (_y / 360) * 5;
    const _d = hasNext ? _cd : _cd + 5;
    return [_y, _d];
  }, [list.length, hasNext]);

  const { run } = useDebounceFn(
    (latest) => {
      if (animationY && Math.abs(Number(latest.y)) + 10 > animationY) {
        onRefresher();
      }
    },
    { wait: 1000 }
  );
  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-[10px] absolute right-[20px] bottom-[16%] text-white h-[280px] overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,1)_10%,rgba(0,0,0,0))]"
    >
      <AnimatePresence>
        {show && (
          <motion.div
            key={`danmaku`}
            initial={{ y: 280 }}
            animate={{ y: -animationY }}
            transition={{
              duration,
              ease: "linear"
            }}
            ref={containerRef}
            onUpdate={run}
          >
            {list.map((item, index) => (
              <Item key={index} data={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
