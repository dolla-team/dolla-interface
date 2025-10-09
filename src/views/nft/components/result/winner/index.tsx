import NftCard from "@/components/nft-card";
import Confetti from "@/components/confetti";
import Avatar from "@/components/avatar";
import clsx from "clsx";
import { formatAddress } from "@/utils/format/address";
import { useAuth } from "@/contexts/auth";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import CloseIcon from "@/components/icons/close";
import { useNftContext } from "@/views/nft/context";
import ReactDOM from "react-dom";

export default function Winner() {
  const { userInfo } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const { pool, onWinnerCallback } = useNftContext();

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }
    gsap
      .timeline()
      .to(cardRef.current, {
        scale: 1, // Rotate 1440 degrees around Y axis
        duration: 2,
        ease: "linear"
      })
      .to(cardRef.current, {
        rotateY: 180,
        duration: 1,
        ease: "linear"
      });
  }, []);
  return (
    <div
      className="w-screen h-screen top-0 left-0 fixed z-[50] flex justify-center items-center"
      style={{
        background:
          "radial-gradient(44.79% 52.28% at 50% 50%, rgba(185, 55, 255, 0.60) 0%, rgba(0, 0, 0, 0.60) 68.75%)",
        backdropFilter: "blur(10px)"
      }}
    >
      <div
        ref={cardRef}
        className="relative z-[10] transition-transform ease-in-out w-[220px] h-[326px] scale-[0.2]"
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        <div className="absolute inset-0 w-full h-full">
          <NftCard data={pool} className="!bg-[#3B3951]" />
        </div>
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            transform: `rotateY(180deg) translateZ(1px)`
          }}
        >
          <NftCard
            className="!bg-[#3B3951]"
            data={pool}
            isResult={true}
            resultContent={
              <div className="flex flex-col items-center justify-center w-[200px] h-[200px] absolute left-[10px] top-[10px] bg-black/50 rounded-[12px] z-[6]">
                <BtcFace userInfo={userInfo} />
                <div className="text-[16px] font-semibold text-white text-center mt-[10px]">
                  {userInfo?.email || formatAddress(userInfo?.user)}
                </div>
              </div>
            }
          />
        </div>
      </div>

      {ReactDOM.createPortal(
        <button
          className="absolute right-[20px] top-[20px] z-[110] button"
          onClick={() => {
            onWinnerCallback();
          }}
        >
          <CloseIcon size={36} />
        </button>,
        document.body
      )}

      <div className="w-[872px] h-[937px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1] bg-[url('/nft/winner-light.png')] bg-contain bg-center bg-no-repeat" />
      <Confetti />
    </div>
  );
}

const BtcFace = ({
  className,
  userInfo
}: {
  className?: string;
  userInfo: any;
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center w-[120px] h-[120px] rounded-full border-[2px] border-[#DD9000] bg-[linear-gradient(180deg,_#FFC93F_0%,_#FFDC84_50%,_#DEAF37_100%)]",
        className
      )}
    >
      <Avatar
        size={94}
        address={userInfo?.user}
        email={userInfo?.show_email}
        src={userInfo?.icon}
        className="rounded-full border-[3px] border-[#DD9000]"
      />
    </div>
  );
};
