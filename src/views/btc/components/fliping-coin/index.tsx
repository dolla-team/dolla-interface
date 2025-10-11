import { useEffect, useRef, useState } from "react";
// import "./index.scss";
import clsx from "clsx";

const frontFace = new Image();
frontFace.src = "/btc/fliping-coin.svg";

import("./index.scss");

export default function FlippingCoin({ start = false }: any) {
  const [flipping, setFlipping] = useState(false);
  const count = useRef(0);

  useEffect(() => {
    if (!flipping && start) {
      setTimeout(() => {
        setFlipping(true);
      }, 50);
    }
  }, [flipping, start]);

  return (
    <div className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] z-[30]">
      <div className="floor">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            className={clsx("line", flipping && "anim")}
            key={index}
            onAnimationEnd={() => {
              count.current++;

              if (count.current === 12) {
                setFlipping(false);
                count.current = 0;
              }
            }}
          ></div>
        ))}
      </div>
      <div className={clsx("coin", flipping && "anim")}>
        <div className="edge">
          {Array.from({ length: 16 }).map((_, index) => (
            <div className="segment" key={index}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
