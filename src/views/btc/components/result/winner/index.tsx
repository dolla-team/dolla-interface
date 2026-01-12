import Avatar from "@/components/avatar";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import { useAuth } from "@/contexts/auth";
import CloseIcon from "@/components/icons/close";
import { formatAddress } from "@/utils/format/address";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useBtcContext } from "../../../context";
import DollaEye from "@/components/dolla-eye";
import { BASE_TOKEN } from "@/config/btc";
import { LightRotation } from "@/views/btc/grand/flip-coin/light";
import BtcFace from "./btc-face";
import MultipleTag from "@/components/multiple-tag";
import WinnerImg from "./img";
import ShareModal from "@/sections/share";
import "./index.scss";
import Confetti from "@/components/confetti";
import PreAnimation from "./pre-animation";

function Winner({ onClose }: { onClose: () => void }) {
  const { userInfo } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);
  const [animationStatus, setAnimationStatus] = useState(0); // 0: coin rotating, 1: show bg
  const coinRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const { poolAmount, getPoolRecommend, pool, bids, isDetail, onReplay } =
    useBtcContext();

  useEffect(() => {
    window.howl.bidSuccess.play();
    if (coinRef.current) {
      gsap
        .timeline()
        .to(coinRef.current, {
          rotateY: 1440, // Rotate 1440 degrees around Y axis
          duration: 2,
          ease: "linear",
          onComplete: () => {
            setAnimationStatus(1);
          }
        })
        .to(coinRef.current, {
          rotateY: 1440 + 180,
          duration: 1,
          delay: 1,
          ease: "linear",
          onComplete: () => {
            setAnimationStatus(2);
          }
        });
      gsap.to(bgRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "linear"
      });
    }
  }, []);

  const returnMultiple = pool.reward_usd / bids;

  return (
    <>
      <Confetti />
      <button
        className="fixed right-[20px] top-[20px] z-[110] button"
        onClick={() => {
          onClose();
          if (!isDetail) {
            clearTimeout(window.poolTimer);
            getPoolRecommend();
          }
        }}
      >
        <CloseIcon size={36} />
      </button>
      <div className="fixed top-0 left-0 w-screen h-screen z-[50]">
        <div className="w-full h-full absolute flex items-center justify-center">
          <div className="absolute z-[1] left-0 top-0 w-full h-full bg-black/50 backdrop-blur-[10px] bg-black" />

          <DollaEye
            className="absolute left-[50%] top-[80px] -translate-x-1/2 z-[20]"
            style={{
              opacity: animationStatus === 2 ? 1 : 0
            }}
          />
        </div>

        <div className="w-full h-full flex pt-[200px] justify-center gap-[78px] relative z-[3]">
          <div className="relative flex flex-col items-center">
            <div className="w-[270px] h-[270px] relative">
              {animationStatus === 2 && (
                <LightRotation
                  size={270}
                  duration={6}
                  className="pointer-events-none z-[1] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                />
              )}
              {animationStatus === 2 && (
                <MultipleTag
                  multipler={formatNumber(returnMultiple, 0, true)}
                  size={110}
                  className="absolute top-[-10px] right-[-10px] z-[3]"
                  textClassName="text-[30px]"
                />
              )}
              <div
                className="transition-transform ease-in-out w-full h-full relative z-[2]"
                style={{
                  transformStyle: "preserve-3d"
                }}
                ref={coinRef}
              >
                {/* Front face (Heads) */}
                <BtcFace className="absolute top-0 left-0" />

                <div
                  className="absolute inset-0 w-full h-full duration-1000 transition-transform ease-in-out rounded-full backface-hidden flex items-center justify-center"
                  style={{
                    transform: `rotateY(180deg) translateZ(1px)`,
                    opacity: animationStatus === 2 ? 1 : 0
                  }}
                >
                  <Avatar
                    size={216}
                    address={userInfo?.user}
                    src={userInfo?.icon}
                    className="rounded-full border-[3px] border-[#DD9000] text-[72px]"
                  />
                </div>
                <BtcFace
                  className="backface-hidden absolute top-0 left-0"
                  style={{
                    transform: `rotateY(180deg) translateZ(1px)`,
                    opacity: animationStatus === 2 ? 0 : 1
                  }}
                />
              </div>
            </div>
            <div
              className="text-center text-white duration-500"
              style={{
                opacity: animationStatus === 2 ? 1 : 0
              }}
            >
              <div className="text-[18px] font-[600]">Winner</div>
              <div className="text-[26px] font-[700] mt-[-4px]">
                {userInfo?.name || formatAddress(userInfo?.user)}
              </div>
            </div>
          </div>

          <div>
            <div className="text-white text-[32px] font-[700] mb-[10px] duration-500">
              <div>Congrats!</div>
              <div>You win</div>
            </div>

            <div className="h-[120px]">
              <>
                <div
                  className={clsx(
                    "font-[DelaGothicOne] text-[62px] flex items-center gap-[10px]"
                  )}
                >
                  <span className="glitch" data-text={poolAmount}>
                    {poolAmount}
                  </span>
                  <span className="glitch" data-text={BASE_TOKEN.symbol}>
                    {BASE_TOKEN.symbol}
                  </span>
                </div>
                <div
                  className={clsx(
                    "font-[DelaGothicOne] text-[32px] text-[#ffc42f]"
                  )}
                >
                  ${formatNumber(pool.reward_usd, 2, true)}
                </div>
                <button
                  className="mt-[20px] button w-[177px] h-[45px] rounded-[12px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] text-[#111111] font-[600] text-[16px]"
                  onClick={() => setShowShareModal(true)}
                >
                  Share dis!
                </button>
              </>
            </div>
          </div>
        </div>
        <WinnerImg />
        <button
          className="absolute bottom-[20px] right-[20px] z-[110] button flex items-center gap-[10px]"
          onClick={onReplay}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="15"
            viewBox="0 0 13 15"
            fill="none"
          >
            <path
              d="M12 5.46717C13.3333 6.23697 13.3333 8.16147 12 8.93127L3 14.1274C1.66667 14.8972 -7.31543e-07 13.935 -6.64245e-07 12.3954L-2.09983e-07 2.00307C-1.42685e-07 0.463467 1.66667 -0.498786 3 0.271015L12 5.46717Z"
              fill="white"
            />
          </svg>
          <span className="text-white text-[20px] font-[Bungee]">Replay</span>
        </button>
      </div>
      <ShareModal
        open={showShareModal}
        onClose={() => {
          setShowShareModal(false);
        }}
        type="winner"
        data={{
          multiple: returnMultiple,
          time: Date.now(),
          bids: bids,
          amount: poolAmount,
          price: pool.reward_usd,
          winner_user: {
            name: userInfo?.name,
            user: userInfo?.user,
            icon: userInfo?.icon
          }
        }}
      />
    </>
  );
}

export default function Result({ onClose }: { onClose: () => void }) {
  const [showResult, setShowResult] = useState(false);
  return showResult ? (
    <Winner onClose={onClose} />
  ) : (
    <PreAnimation
      onClose={() => {
        setShowResult(true);
      }}
    />
  );
}
