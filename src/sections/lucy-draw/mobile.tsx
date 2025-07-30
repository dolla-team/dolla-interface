import clsx from "clsx";
import { motion } from "framer-motion";
import WinResult from "./win-result";
import Timer from "./timer";
import Avatar from "@/components/avatar";
import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import LucyDrawCard from "./card";

export default function LucyDrawMobile(props: any) {
  const {
    setIsHistoryOpen,
    setHistoryRound,
    currentRound,
    prizeAmount,
    status,
    tickets,
    winningList,
    setStatus,
    fetchResult,
    className
  } = props;
  const [open, setOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }, [currentRound]);
  return (
    <>
      <div
        className={clsx(
          "fixed bottom-[30px] left-0 z-[10] w-[159px] h-[57px] duration-300",
          open ? "translate-x-[0px]" : "translate-x-[-68px]",
          className
        )}
        onClick={() => {
          setShowCard(true);
        }}
      >
        <Bg />
        {status === 0 && (
          <Timer
            onTimeUp={() => {
              if (currentRound) {
                setStatus(1);
                fetchResult();
              }
            }}
            currentRound={currentRound}
            className="absolute top-[-20px] right-[-30px] !border-[#7348FF] !bg-[#000]"
            key={currentRound}
          />
        )}
        {status !== 0 && (
          <div className="absolute top-[-20px] right-[-30px] border border-[#7348FF] rounded-[20px] w-[91px] h-[30px] bg-[#000]/30 text-white text-[12px] flex items-center justify-center">
            {status === 1 ? "Drawing..." : "Congrats!"}
          </div>
        )}
        {status === 2 && (
          <div className="absolute top-[16px] right-[16px] flex items-center justify-center overflow-hidden w-[120px]">
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -150] // Move from right to left
              }}
              transition={{
                duration: 6,
                ease: "linear"
              }}
            >
              {winningList.map((item: any, index: number) => (
                <Avatar
                  address={item.user}
                  key={`first-${index}`}
                  className="border border-[#DD9000] ml-[-10px] rounded-full"
                  size={30}
                  email={item.user_info?.email}
                />
              ))}
            </motion.div>
          </div>
        )}
        {status !== 2 && (
          <div className="absolute top-[16px] right-[26px]">
            <img className="w-[58px] h-[34px]" src="/btc/ticket4.png" />
            <div className="absolute top-[-2px] right-[-20px] min-w-[30px] px-[5px] py-[2px] border border-black rounded-[16px] bg-[#FF0A7C] text-white text-[12px] font-[DelaGothicOne]">
              x{tickets}
            </div>
          </div>
        )}
        <div
          className="
              absolute 
              left-[6px]
              top-[4px]
              text-white
              text-[14px]
              [text-shadow:0_0_10px_#8465FF]
              font-[DelaGothicOne]
              "
          style={{
            WebkitTextStroke: "1px #3A3A3A"
          }}
        >
          <div>${prizeAmount.toLocaleString()}</div>
          <div className="mt-[-6px]">LUCYK</div>
          <div className="mt-[-8px]">DRAW</div>
        </div>
      </div>
      <WinResult
        onShowHistory={() => {
          setIsHistoryOpen(true);
          setHistoryRound(currentRound);
        }}
      />
      <Modal open={showCard} onClose={() => setShowCard(false)}>
        <div className="w-full bg-black">
          <LucyDrawCard {...props} />
        </div>
      </Modal>
    </>
  );
}

const Bg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="159"
      height="57"
      viewBox="0 0 159 57"
      fill="none"
      className="absolute top-0 left-0"
    >
      <foreignObject x="-52" y="-50" width="260.794" height="157">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_2370_1667_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <path
        data-figma-bg-blur-radius="50"
        d="M153.788 0.5C157.061 0.500074 159.239 3.88289 157.885 6.8623L138.652 49.1729C136.624 53.635 132.175 56.4998 127.273 56.5H-1.5V0.5H153.788Z"
        fill="url(#paint0_radial_2370_1667)"
        stroke="#7C68FF"
      />
      <defs>
        <clipPath
          id="bgblur_0_2370_1667_clip_path"
          transform="translate(52 50)"
        >
          <path d="M153.788 0.5C157.061 0.500074 159.239 3.88289 157.885 6.8623L138.652 49.1729C136.624 53.635 132.175 56.4998 127.273 56.5H-1.5V0.5H153.788Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_2370_1667"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(79.5 28.5) scale(80.5 27.5)"
        >
          <stop stopColor="#7C68FF" />
          <stop offset="1" />
        </radialGradient>
      </defs>
    </svg>
  );
};
