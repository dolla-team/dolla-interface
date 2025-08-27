import Item from "./item";
import { AnimatePresence, motion } from "framer-motion";
import useBidList from "./use-bid-list";
import { useDebounceFn } from "ahooks";
import { useMemo, useRef, useState } from "react";
import { useNftContext } from "../../context";

export default function BidsInfoWrapper() {
  const [refresher, setRefresher] = useState(0);
  const { pool } = useNftContext();
  return (
    pool?.status === 1 && (
      <BidsInfoInner
        key={refresher}
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

  const [animationX, duration] = useMemo(() => {
    if (!list.length) return [0, 10];
    const containerWidth = Math.max(
      containerRef.current?.clientWidth || 0,
      window.innerWidth
    );
    const _cx = containerWidth;
    const _x = hasNext ? _cx + 360 : _cx + window.innerWidth * 2;

    const _d = Math.ceil(_x / window.innerWidth) * 20;
    return [_x, _d];
  }, [list.length, hasNext]);

  const { run } = useDebounceFn(
    (latest) => {
      if (animationX && Math.abs(Number(latest.x)) >= Math.abs(animationX)) {
        onRefresher();
      }
    },
    { wait: 500 }
  );

  return (
    <div
      ref={containerRef}
      className="absolute right-[20px] bottom-[20%] text-white w-full overflow-hidden [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,1)_10%,rgba(0,0,0,0))]"
    >
      <AnimatePresence>
        {show && (
          <motion.div
            key={`danmaku`}
            initial={{ x: window.innerWidth }}
            animate={{ x: -animationX }}
            transition={{
              duration: duration,
              ease: "linear"
            }}
            ref={containerRef}
            onUpdate={run}
          >
            <div className="flex gap-[10px] min-w-[100vw]">
              {list
                .filter((item, i) => i % 2)
                .map((item, index) => (
                  <Item key={index} data={item} />
                ))}
            </div>
            <div className="flex gap-[10px] pl-[40px] min-w-[100vw]">
              {list
                .filter((item, i) => !(i % 2))
                .map((item, index) => (
                  <Item key={index} data={item} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
