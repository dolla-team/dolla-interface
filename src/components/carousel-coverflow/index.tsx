import clsx from "clsx";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const rotate = 20;
const radius = 39.68; // vw
const rotateSpeed = 60; // seconds

const CarouselCoverflow = (props: any, ref: any) => {
  const { className, list, initRotate = 0, isDebug } = props;

  const [containerRef, containerAnimate] = useAnimate();
  const containerRotate = useMotionValue(initRotate);
  const containerAnimation = useRef<any>(null);
  const [cardRotate, setCardRotate] = useState(initRotate);

  const [cardIndex] = useMemo(() => {
    const maxIndex = 360 / rotate - 1;
    const prevRotate = cardRotate || 0;
    const prevRotateAbs = Math.abs(prevRotate);
    const prevRotateReal = prevRotateAbs % 360;
    const currentIndex = Math.floor((prevRotateReal + rotate / 2) / rotate);
    return [Math.max(0, Math.min(maxIndex, currentIndex))];
  }, [cardRotate]);

  const cards = useMemo(() => {
    const _cards = [];

    const counts = 360 / rotate;
    for (let i = 0; i < counts; i++) {
      const angle = i * rotate;

      _cards.push({
        key: i + 1,
        angle: angle,
        width: "19.84vw",
        height: "29.50vw",
        content: (
          <div
            className="preserve-3d"
            style={{
              width: "19.84vw",
              height: "29.50vw",
            }}
          >
            <div className="w-full h-full flex justify-center items-center">
              {list?.[i]?.content || null}
            </div>
          </div>
        )
      });
    }
    return _cards;
  }, [list]);

  useEffect(() => {
    const unsubscribe = containerRotate.on("change", (latestValue) => {
      setCardRotate(latestValue);
    });

    return () => unsubscribe();
  }, [containerRotate]);

  const onRotate = () => {
    if (!containerRef.current) return;
    const prevRotate = containerRotate.get() || 0;
    containerAnimation.current = containerAnimate(containerRef.current, {
      rotateY: [prevRotate, -360 + prevRotate],
    }, {
      duration: rotateSpeed,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
  };

  useEffect(() => {
    if (!list || !list.length) {
      return;
    }
    onRotate();
  }, [list]);

  const handleScroll = async (type: any, opts?: { target?: number; }) => {
    if (!containerAnimation.current) return;

    const { target } = opts ?? {};

    const rotateTo = (rotateY: number) => new Promise((resolve) => {
      containerAnimate(containerRef.current, {
        rotateY,
      }, {
        duration: 0.15,
        ease: "easeInOut",
        onComplete: () => {
          resolve(true)
        },
      });
    });

    switch (type) {
      case "stop":
        containerAnimation.current.stop();
        rotateTo(0);
        break;
      case "play":
        onRotate();
        break;
      case "pause":
        containerAnimation.current.pause();
        break;
      case "rotate":
        containerAnimation.current.pause();
        const maxIndex = 360 / rotate - 1;
        const targetIndex = Math.max(0, Math.min(maxIndex, target || 0));
        const targetRotateY = targetIndex * rotate;
        const targetRotateYFinal = -Math.ceil(Math.abs(containerRotate.get() || 0) / 360) * 360 - targetRotateY;
        rotateTo(targetRotateYFinal);
        break;
      default:
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    cardIndex,
    containerRotate,
    cardRotate,
    handleScroll,
  }));

  return (
    <div className={clsx("w-full h-[29.50vw] relative", className)}>
      <motion.div
        ref={containerRef}
        className="flex items-center justify-center w-full h-full will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: `center center ${radius / 2}vw`,
          rotateY: containerRotate,
        }}
      />
      <motion.div
        className="flex items-center justify-center w-full h-full will-change-transform mt-[-29.50vw] backface-hidden"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: `center center ${radius / 2}vw`,
        }}
      >
        {cards.map((item: any) => (
          <motion.div
            key={item.key}
            className="absolute backface-hidden"
            style={{
              transform: `perspective(100vw) rotateY(${item.angle + cardRotate}deg) translateZ(${radius}vw) scale(${1 / (100 / (100 - radius))})`,
              transformStyle: "preserve-3d",
            }}
          >
            {item.content}
          </motion.div>
        ))}
      </motion.div>
      <img
        src="/nfts/carousel-arrow.png"
        alt=""
        className="w-[52px] h-[69px] shrink-0 absolute z-[1] left-1/2 -translate-x-1/2 top-[-27px]"
      />
      {
        isDebug && (
          <div className="absolute top-[-50px] left-0 z-[1] flex items-center gap-[10px]">
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleScroll("stop")}
            >
              stop
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleScroll("pause")}
            >
              pause
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleScroll("play")}
            >
              play
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleScroll("rotate", { target: 8 })}
            >
              rotate to index 8
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
            >
              current index: {cardIndex}
            </button>
          </div>
        )
      }
    </div>
  );
};

export default forwardRef(CarouselCoverflow);
