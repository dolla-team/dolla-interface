import { useDollaEyeContext } from "@/contexts/dolla-eye";
import { EEyeStatus, EEyeType } from "@/hooks/use-dolla-eye";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const DollaEye = (props: any) => {
  const { className, ...restProps } = props;

  const { currentEye } = useDollaEyeContext();

  const eyeRef = useRef<any>(null);
  const eyePupil = useRef<any>(null);
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

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
      const maxRadius = Math.min(eyeRect.width, eyeRect.height) * 0.4;

      // Limit pupil movement range
      let limitedX = mouseX;
      let limitedY = mouseY;

      if (distance > maxRadius) {
        limitedX = (mouseX / distance) * maxRadius;
        limitedY = (mouseY / distance) * maxRadius;
      }

      setPupilPosition({ x: limitedX, y: limitedY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={clsx("flex items-center flex-nowrap", className)}
      {...restProps}
    >
      <img
        src="/logo-eye/d.svg"
        alt="d"
        className="w-[36px] h-[46px] shrink-0 object-contain object-center relative z-[3]"
      />
      <div
        ref={eyeRef}
        className="w-[59px] h-[56px] rounded-[30px] overflow-hidden shrink-0 relative z-[2] ml-[-11px]"
      >
        {/*#region eye socket*/}
        <div className="z-100 absolute w-full h-full left-0 top-0 bg-[url('/logo-eye/eye-socket.svg')] bg-no-repeat bg-contain bg-center" />
        {/*#endregion*/}

        {/*#region eye background layer 1*/}
        <div className="z-[1] absolute w-full h-full left-0 top-0 bg-[#FFF3D4]" />
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.Normal*/}
        {
          currentEye.status === EEyeStatus.Normal && (
            <div className="z-[2] absolute w-full h-full flex justify-center items-center">
              <motion.div
                ref={eyePupil}
                className="shrink-0 rounded-full bg-[#000000]"
                style={{
                  width: currentEye.pupilSize ?? 20,
                  height: currentEye.pupilSize ?? 20,
                }}
                animate={{
                  x: pupilPosition.x,
                  y: pupilPosition.y,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              ></motion.div>
            </div>
          )
        }
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.Mood*/}
        {
          currentEye.status === EEyeStatus.Mood && (
            <>
              <div className="z-[2] absolute w-full h-full flex justify-center items-center">
                <div
                  ref={eyePupil}
                  className="shrink-0 rounded-full bg-[#000000] flex justify-center items-center"
                  style={{
                    width: currentEye.pupilSize ?? 40,
                    height: currentEye.pupilSize ?? 40,
                  }}
                >
                  {
                    currentEye.icon && (
                      currentEye.icon === "sparkling" ? (
                        <div className="relative w-full h-full flex justify-center items-center flex-col gap-[2px]">
                          <motion.div
                            className="w-[7px] h-[7px] rounded-full bg-white ml-[7px]"
                            animate={{
                              scaleX: [0.8, 1.1, 0.8],
                              scaleY: [0.9, 1.05, 0.9],
                              translateX: [0, -2, 2, 0],
                              translateY: [0, -1, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <motion.div
                            className="w-[15px] h-[15px] rounded-full bg-white ml-[-7px]"
                            animate={{
                              scaleX: [0.9, 1.1, 0.9],
                              scaleY: [0.9, 1.05, 0.9],
                              translateX: [0, -1, 1, 0],
                              translateY: [0, -1, 1, 0],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.8,
                            }}
                          />
                        </div>
                      ) : (
                        <motion.img
                          src={currentEye.icon}
                          alt=""
                          className="shrink-0 object-contain object-center"
                          style={{
                            width: currentEye.iconSize?.[0] ?? 20,
                            height: currentEye.iconSize?.[1] ?? 20,
                          }}
                          {...currentEye.animation}
                        />
                      )
                    )
                  }
                </div>
              </div>
              {
                [EEyeType.PrizeLowPTS, EEyeType.PrizeBoth].includes(currentEye.type) && (
                  <motion.img
                    src="/logo-eye/eyelid.svg"
                    alt=""
                    className="z-[3] absolute w-full h-full shrink-0 object-contain object-top"
                    {...currentEye.animation}
                  />
                )
              }
            </>
          )
        }
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.IconAnimate*/}
        {
          currentEye.status === EEyeStatus.IconAnimate && (
            <div className="z-[2] absolute w-full h-full flex justify-center items-center">
              {
                currentEye.icon && (
                  <motion.img
                    src={currentEye.icon}
                    alt=""
                    className="shrink-0 object-contain object-center"
                    style={{
                      width: currentEye.iconSize?.[0] ?? 52,
                      height: currentEye.iconSize?.[1] ?? 52,
                    }}
                    {...currentEye.animation}
                  />
                )
              }
            </div>
          )
        }
        {/*#endregion*/}

        {/*#region eye pupil - EEyeStatus.Money*/}
        {
          currentEye.status === EEyeStatus.Money && (
            <motion.div
              className="z-[2] absolute w-full h-full flex justify-center items-center"
              {...currentEye.animation}
            >
              {
                currentEye.icon && (
                  <motion.img
                    src={currentEye.icon}
                    alt=""
                    className="shrink-0 object-contain object-center"
                    style={{
                      width: currentEye.iconSize?.[0] ?? 34,
                      height: currentEye.iconSize?.[1] ?? 40,
                    }}
                  />
                )
              }
            </motion.div>
          )
        }
        {/*#endregion*/}

      </div>
      <img
        src="/logo-eye/lla.svg"
        alt="lla"
        className="w-[84px] h-[46px] shrink-0 object-contain object-center relative z-[1] ml-[-8px]"
      />
    </div>
  );
};

export default DollaEye;
