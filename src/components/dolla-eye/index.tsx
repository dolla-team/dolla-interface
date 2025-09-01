import { useDollaEyeContext } from "@/contexts/dolla-eye";
import { EEyeStatus, EEyeType } from "@/hooks/use-dolla-eye";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";

const BASE_HEIGHT = 56;

const DollaEye = (props: any) => {
  const {
    className,
    height = BASE_HEIGHT,
    onlyEye = false,
    ...restProps
  } = props;

  const { currentEye } = useDollaEyeContext();

  const eyeRef = useRef<any>(null);
  const eyePupil = useRef<any>(null);
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  const [
    rate,
    textHeight,
    textDWidth,
    textLlaWidth,
    textLeft,
    eyeLeft,
    eyeWidth,
    currentIconSize,
    currentPupilSize,
    sparklingSize
  ] = useMemo(() => {
    const textHeight = (46 / BASE_HEIGHT) * height;
    const textDWidth = (36 / BASE_HEIGHT) * height;
    const textLlaWidth = (84 / BASE_HEIGHT) * height;
    const textLeft = (8 / BASE_HEIGHT) * height;
    const eyeLeft = (11 / BASE_HEIGHT) * height;
    const eyeWidth = (59 / BASE_HEIGHT) * height;
    let currentIconSize;
    let currentPupilSize;
    const sparklingSize = [
      (7 / BASE_HEIGHT) * height,
      (15 / BASE_HEIGHT) * height
    ];
    if (currentEye.iconSize) {
      currentIconSize = [
        (currentEye.iconSize[0] / BASE_HEIGHT) * height,
        (currentEye.iconSize[1] / BASE_HEIGHT) * height
      ];
    }
    if (currentEye.pupilSize) {
      currentPupilSize = (currentEye.pupilSize / BASE_HEIGHT) * height;
    }

    return [
      height / BASE_HEIGHT,
      textHeight,
      textDWidth,
      textLlaWidth,
      textLeft,
      eyeLeft,
      eyeWidth,
      currentIconSize,
      currentPupilSize,
      sparklingSize
    ];
  }, [height, currentEye]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current || !eyePupil.current) return;

      const eyeRect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      // Calculate mouse position relative to eye center
      const mouseX = e.clientX - eyeCenterX;
      const mouseY = e.clientY - eyeCenterY;

      // Calculate distance
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

      // Maximum radius for pupil movement (40% of eye radius)
      const maxRadius = Math.min(eyeRect.width, eyeRect.height) * 0.3;

      // Limit pupil movement range
      let limitedX = mouseX;
      let limitedY = mouseY;

      if (distance > maxRadius) {
        limitedX = (mouseX / distance) * maxRadius;
        limitedY = (mouseY / distance) * maxRadius;
      }

      setPupilPosition({ x: limitedX, y: limitedY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!currentEye) return null;

  return (
    <div
      className={clsx("flex items-center flex-nowrap", className)}
      {...restProps}
    >
      {!onlyEye && (
        <img
          src="/logo-eye/d.svg"
          alt="d"
          className="shrink-0 object-contain object-center relative z-[3]"
          style={{
            width: textDWidth,
            height: textHeight
          }}
        />
      )}
      <div
        ref={eyeRef}
        className="overflow-hidden shrink-0 relative z-[2]"
        style={{
          marginLeft: -eyeLeft,
          width: eyeWidth,
          height: height,
          borderRadius: height / 2
        }}
      >
        {/*#region eye socket*/}
        <div className="z-100 absolute w-full h-full left-0 top-0 bg-[url('/logo-eye/eye-socket.svg')] bg-no-repeat bg-contain bg-center" />
        {/*#endregion*/}

        {/*#region eye background layer 1*/}
        <div
          className="z-[1] absolute w-[calc(100%_-_2px)] h-[calc(100%_-_2px)] left-[1px] top-[1px] bg-[#fff]"
          style={{ borderRadius: height / 2 }}
        />
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.Normal*/}
        {currentEye.status === EEyeStatus.Normal && (
          <div className="z-[2] absolute w-full h-full flex justify-center items-center">
            <motion.div
              ref={eyePupil}
              className="shrink-0 rounded-full bg-[#000000]"
              style={{
                width: currentPupilSize,
                height: currentPupilSize
              }}
              animate={{
                x: pupilPosition.x,
                y: pupilPosition.y
              }}
            ></motion.div>
          </div>
        )}
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.Mood*/}
        {currentEye.status === EEyeStatus.Mood && (
          <>
            <div className="z-[2] absolute w-full h-full flex justify-center items-center">
              <div
                ref={eyePupil}
                className="shrink-0 rounded-full bg-[#000000] flex justify-center items-center"
                style={{
                  width: currentPupilSize ?? 40,
                  height: currentPupilSize ?? 40
                }}
              >
                {currentEye.icon &&
                  (currentEye.icon === "sparkling" ? (
                    <div className="relative w-full h-full flex justify-center items-center flex-col gap-[2px]">
                      <motion.div
                        className="w-[7px] h-[7px] rounded-full bg-white ml-[7px]"
                        style={{
                          width: sparklingSize?.[0],
                          height: sparklingSize?.[0]
                        }}
                        animate={{
                          scaleX: [0.8, 1.1, 0.8],
                          scaleY: [0.9, 1.05, 0.9],
                          translateX: [0, -2, 2, 0],
                          translateY: [0, -1, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="w-[15px] h-[15px] rounded-full bg-white ml-[-7px]"
                        style={{
                          width: sparklingSize?.[1],
                          height: sparklingSize?.[1]
                        }}
                        animate={{
                          scaleX: [0.9, 1.1, 0.9],
                          scaleY: [0.9, 1.05, 0.9],
                          translateX: [0, -1, 1, 0],
                          translateY: [0, -1, 1, 0]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.8
                        }}
                      />
                    </div>
                  ) : (
                    <motion.img
                      src={currentEye.icon}
                      alt=""
                      className="shrink-0 object-contain object-center"
                      style={{
                        width: currentIconSize?.[0] ?? 20,
                        height: currentIconSize?.[1] ?? 20
                      }}
                      {...currentEye.animation}
                    />
                  ))}
              </div>
            </div>
            {[EEyeType.PrizeLowPTS, EEyeType.PrizeBoth].includes(
              currentEye.type
            ) && (
              <motion.img
                src="/logo-eye/eyelid.svg"
                alt=""
                className="z-[3] absolute w-full h-full shrink-0 object-contain object-top"
                {...currentEye.animation}
              />
            )}
          </>
        )}
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.IconAnimate*/}
        {currentEye.status === EEyeStatus.IconAnimate && (
          <div className="z-[2] absolute w-full h-full flex justify-center items-center">
            {currentEye.icon && (
              <motion.img
                src={currentEye.icon}
                alt=""
                className="shrink-0 object-contain object-center"
                style={{
                  width: currentIconSize?.[0] ?? 52,
                  height: currentIconSize?.[1] ?? 52
                }}
                {...currentEye.animation}
              />
            )}
          </div>
        )}
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.Money*/}
        {currentEye.status === EEyeStatus.Money && (
          <motion.div
            className="z-[2] absolute w-full h-full flex justify-center items-center"
            {...currentEye.animation}
          >
            {currentEye.icon && (
              <motion.img
                src={currentEye.icon}
                alt=""
                className="shrink-0 object-contain object-center"
                style={{
                  width: currentIconSize?.[0] ?? 34,
                  height: currentIconSize?.[1] ?? 40
                }}
              />
            )}
          </motion.div>
        )}
        {/*#endregion*/}
      </div>
      {!onlyEye && (
        <img
          src="/logo-eye/lla.svg"
          alt="lla"
          className="shrink-0 object-contain object-center relative z-[1]"
          style={{
            marginLeft: -textLeft,
            width: textLlaWidth,
            height: textHeight
          }}
        />
      )}
    </div>
  );
};

export default DollaEye;
