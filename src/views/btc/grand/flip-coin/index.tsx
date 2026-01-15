import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useMemo
} from "react";
import clsx from "clsx";
import { BackPointsFace, FrontFace } from "./faces";
import useUserInfoStore from "@/stores/use-user-info";
import { motion } from "framer-motion";
import { LightRotation } from "./light";

// import "./index.css";
import("./index.css");

const Coin = forwardRef<any, any>(
  (
    {
      onFlipComplete,
      disabled,
      size = 62,
      points,
      index,
      coinContainerRef,
      ticket,
      bids,
      setFlipStatus,
      isWinner,
      flipStatus
    },
    ref
  ) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const coinRef = useRef<any>(null);
    const userInfoStore: any = useUserInfoStore();
    const [showTicket, setShowTicket] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    // Check if element is in viewport
    const isElementInViewport = (element: HTMLElement) => {
      return (
        element.offsetTop + element.offsetHeight <
          coinContainerRef.current?.clientHeight +
            coinContainerRef.current?.scrollTop &&
        element.offsetTop > coinContainerRef.current?.scrollTop - 10
      );
    };

    const onFlip = (force = false, notAuto = false) => {
      if ((disabled || isAnimating) && !force) return;
      if (isFlipped && !force) {
        onFlipComplete?.(index, false, notAuto);
        return;
      }

      if (force) {
        setIsFlipped(false);
        return;
      }

      // Only scroll into view if element is not in viewport
      if (coinRef.current && !isElementInViewport(coinRef.current)) {
        // Scroll within the container instead of the entire document
        const container = coinContainerRef.current;
        const coinElement = coinRef.current;
        const containerRect = container.getBoundingClientRect();
        const coinRect = coinElement.getBoundingClientRect();

        // Calculate the scroll position to bring the coin into view
        const scrollTop =
          container.scrollTop +
          (coinRect.top - containerRect.top) -
          containerRect.height / 2 +
          coinRect.height / 2;

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth"
        });
      }

      setIsAnimating(true);
      setIsFlipped(!isFlipped);
      window.howl.flip.play();
      if (ticket === "0") {
        setShowTicket(true);
      }
      if (Number(points) > 0) {
        setShowPoints(true);
      }
      userInfoStore.set({
        prize: {
          points: Number(userInfoStore.prize.points) + Number(points),
          tickets:
            Number(userInfoStore.prize.tickets) + Number(ticket === "0" ? 1 : 0)
        }
      });
      if (notAuto) {
        setFlipStatus(4);
      }
      const duration = (() => {
        if (isWinner) {
          return 200;
        }
        if (bids === 10) {
          return 300;
        }
        if (bids === 50) {
          return 120;
        }
        if (bids === 100) {
          return 60;
        }
        return 600;
      })();

      // Trigger callback after animation
      setTimeout(() => {
        setIsAnimating(false);
        onFlipComplete?.(index, true, notAuto);
      }, duration); // Reduced from 1000ms to 600ms to start exit animation earlier
    };

    const onCollect = () => {
      const rect = coinContainerRef.current.getBoundingClientRect();
      const coinRect = coinRef.current.getBoundingClientRect();
      const targetW = rect.width;
      const targetH = rect.height;

      const targetLeft = targetW / 2 + rect.x - coinRect.x - coinRect.width / 2;
      const targetTop = targetH / 2 + rect.y - coinRect.y - coinRect.height / 2;
      if (bids > 1) {
        coinRef.current.style.transform = `translate(${targetLeft}px, ${targetTop}px)`;
      } else {
        coinRef.current.style.transform = `scale(0)`;
      }

      coinRef.current.style.opacity = "0";
      coinRef.current.style.transition = "all 0.3s ease-in-out";
    };

    const onRevert = () => {
      if (bids > 1) {
        coinRef.current.style.transform = `translate(0, 0)`;
      } else {
        coinRef.current.style.transform = `scale(1)`;
      }
      coinRef.current.style.opacity = "1";
    };

    useImperativeHandle(ref, () => ({
      flip: onFlip,
      collect: onCollect,
      revert: onRevert
    }));

    const thickness = Math.max(8, size * 0.1);

    const [left, top] = useMemo(() => {
      if (!coinRef.current) return [0, 0];
      const _left = coinRef.current.offsetLeft;
      const _top = coinRef.current.offsetTop;

      return [_left, _top];
    }, [coinRef.current]);

    return (
      <>
        <div
          className={clsx(
            "relative perspective-[1000px] duration-300 ease-in-out",
            (flipStatus === 4 || flipStatus === 5) && "cursor-pointer",
            isAnimating && isFlipped && isWinner && "scale-110"
          )}
          style={{
            width: `${size}px`,
            height: `${size}px`
          }}
          onClick={() => {
            onFlip(false, true);
            clearTimeout(window.autoFlipTimer);
            window.autoFlipTimer = -1;
          }}
          ref={coinRef}
        >
          <div
            className="relative w-full h-full transition-transform duration-300 ease-in-out preserve-3d"
            style={{
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Front face (Heads) */}
            <FrontFace size={size} thickness={thickness} />

            {/* Back face (Tails) */}
            <BackPointsFace
              size={size}
              thickness={thickness}
              points={points}
              isWinner={isWinner}
            />
          </div>
        </div>
        {!!showTicket && (
          <motion.div
            initial={{ y: showPoints ? 90 : 0, opacity: 1 }}
            animate={{
              y: showPoints ? -30 : -120,
              opacity: 0
            }}
            transition={{
              y: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              },
              opacity: {
                duration: 0.8,
                ease: "easeOut"
              }
            }}
            onAnimationComplete={() => {
              setShowTicket(false);
            }}
            className="absolute z-[10] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[320px] h-[187px] flex items-center justify-center"
          >
            <img src="/btc/ticket.png" className="w-[274px] h-[187px]" />
            <span
              className="text-[#FFEF43] font-[AlfaSlabOne] text-[60px] mt-[-20px]"
              style={{
                WebkitTextStroke: "2px #5E3737"
              }}
            >
              x1
            </span>
          </motion.div>
        )}
        {!!showPoints && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: -120,
              opacity: 0
            }}
            transition={{
              y: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              },
              opacity: {
                duration: 0.8,
                ease: "easeOut"
              }
            }}
            onAnimationComplete={() => {
              setShowPoints(false);
            }}
            className="absolute z-[10] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[320px] h-[187px] flex items-center justify-center"
          >
            <span
              className="text-[#FFEF43] font-[AlfaSlabOne] text-[60px] mt-[-20px]"
              style={{
                WebkitTextStroke: "2px #5E3737"
              }}
            >
              + {points}
            </span>
          </motion.div>
        )}
        {!!(left && top) && isAnimating && isWinner && (
          <LightRotation
            size={size}
            duration={6}
            style={{ top: top + size / 2 + "px", left: left + size / 2 + "px" }}
            className="pointer-events-none z-[10]"
          />
        )}
      </>
    );
  }
);

export default Coin;
