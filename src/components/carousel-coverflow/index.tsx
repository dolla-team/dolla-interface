import { useDebounceFn } from "ahooks";
import clsx from "clsx";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const rotate = 20;
const radius = 39.68; // vw
const rotateSpeed = 60; // seconds

const CarouselCoverflow = (props: any, ref: any) => {
  const { className, list, initRotate = 0, isDebug, isDrag = true } = props;

  const [containerRef, containerAnimate] = useAnimate();
  const containerRotate = useMotionValue(initRotate);
  const containerAnimation = useRef<any>(null);
  const [cardRotate, setCardRotate] = useState(initRotate);

  // Drag-related state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartRotate = useRef(0);

  const [cardIndex] = useMemo(() => {
    const maxIndex = 360 / rotate - 1;
    const prevRotate = cardRotate || 0;
    const prevRotateAbs = Math.abs(prevRotate);
    const prevRotateReal = prevRotateAbs % 360;
    const currentIndex = Math.floor((prevRotateReal + rotate / 2) / rotate);
    return [Math.max(0, Math.min(maxIndex, currentIndex))];
  }, [cardRotate]);

  const [cards, listLength] = useMemo(() => {
    const _cards = [];

    const counts = 360 / rotate;
    for (let i = 0; i < counts; i++) {
      const angle = i * rotate;

      _cards.push({
        key: i + 1,
        angle: angle,
        content: (
          <div
            className="preserve-3d"
            style={{
              width: "clamp(1px, 19.84vw, calc(var(--dolla-laptop-width-base)*0.1984))",
              height: "clamp(1px, 29.50vw, calc(var(--dolla-laptop-width-base)*0.2950))",
            }}
          >
            <div className="w-full h-full flex justify-center items-center">
              {list?.[i]?.content || null}
            </div>
          </div>
        )
      });
    }
    return [_cards, list?.length];
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

  const { run: onRotateDebounce, cancel: cancelOnRotateDebounce } = useDebounceFn(onRotate, {
    wait: 3000,
  });

  // Direct rotation update for smooth dragging
  const updateRotate = (newRotate: number) => {
    containerRotate.set(newRotate);
  };

  useEffect(() => {
    if (!listLength) {
      return;
    }
    onRotate();
  }, [listLength]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

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

  const handleRotate = async (type: any, opts?: { target?: number; }) => {
    if (!containerAnimation.current) return;

    const { target } = opts ?? {};

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

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!isDrag) return;
    
    isDragging.current = true;
    dragStartX.current = event.clientX;
    dragStartRotate.current = containerRotate.get();

    // Cancel any pending auto-rotate
    cancelOnRotateDebounce();

    // Stop current animation completely to prevent flickering
    if (containerAnimation.current) {
      containerAnimation.current.stop();
      containerAnimation.current = null;
    }

    // Add global event listeners
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging.current) return;

    const deltaX = event.clientX - dragStartX.current;
    const sensitivity = 0.1; // Drag sensitivity, can be adjusted as needed
    let newRotate = dragStartRotate.current + deltaX * sensitivity;
    if (newRotate > 0) {
      newRotate = -(360 - newRotate);
    }

    // Direct update for smooth dragging
    updateRotate(newRotate);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    // Remove global event listeners
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);

    // Auto-align to the nearest card position
    const currentRotate = containerRotate.get();
    const nearestCardIndex = Math.round(Math.abs(currentRotate) / rotate);
    const targetRotate = -nearestCardIndex * rotate;

    // Smooth animation to target position
    rotateTo(targetRotate).then(() => {
      // Start auto rotation after alignment is complete
      onRotateDebounce();
    });
  };

  useImperativeHandle(ref, () => ({
    cardIndex,
    containerRotate,
    cardRotate,
    handleRotate,
    isDrag,
  }));

  return (
    <div className={clsx("min-w-[clamp(1px,_100vw,_calc(var(--dolla-laptop-width-base)*1))] w-[clamp(1px,_100vw,_calc(var(--dolla-laptop-width-base)*1))] h-[clamp(1px,_29.50vw,_calc(var(--dolla-laptop-width-base)*0.2950))] mx-auto relative", className)}>
      <motion.div
        ref={containerRef}
        className="flex items-center justify-center w-full h-full will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: `center center clamp(1px, ${radius / 2}vw, calc(var(--dolla-laptop-width-base)*${radius / 200}))`,
          rotateY: containerRotate,
        }}
      />
      <motion.div
        id="coverflowContainer"
        className={`flex items-center justify-center w-full h-full will-change-transform -mt-[clamp(1px,_29.50vw,_calc(var(--dolla-laptop-width-base)*0.2950))] backface-hidden ${isDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: `center center clamp(1px, ${radius / 2}vw, calc(var(--dolla-laptop-width-base)*${radius / 200}))`,
          cursor: isDrag ? 'grab' : 'default',
        }}
        drag={false}
        onPointerDown={isDrag ? handlePointerDown : undefined}
      >
        {cards.map((item: any) => (
          <motion.div
            key={item.key}
            className="absolute backface-hidden"
            style={{
              transform: `perspective(100vw) rotateY(${item.angle + cardRotate}deg) translateZ(clamp(1px, ${radius}vw, calc(var(--dolla-laptop-width-base)*0.3968))) scale(clamp(0.1, ${1 / (100 / (100 - radius))}, 1))`,
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
              onClick={() => handleRotate("stop")}
            >
              stop
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleRotate("pause")}
            >
              pause
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleRotate("play")}
            >
              play
            </button>
            <button
              type="button"
              className="button text-white bg-[#743EFF] rounded-[6px] h-[32px] text-center leading-[32px] px-[10px] uppercase"
              onClick={() => handleRotate("rotate", { target: 8 })}
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
