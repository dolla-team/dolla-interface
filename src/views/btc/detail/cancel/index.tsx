import ButtonV2 from "@/components/button/v2";
import useClaimSlash from "@/hooks/solana/use-claim-slash";
import useIsMobile from "@/hooks/use-is-mobile";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Cancel({ data }: { data: any }) {
  const { claiming, onClaim } = useClaimSlash({
    onClaimSuccess() {
      setClaimed(true);
    }
  });
  const [claimed, setClaimed] = useState<boolean | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    setClaimed(data.is_claim);
  }, [data]);

  return !data.user_draw_attempt ? (
    <div
      className={clsx(
        "rounded-[20px] border border-[#605D55] flex flex-col items-center justify-center",
        isMobile
          ? "w-[calc(100%-24px)] h-[254px] ml-[12px] mt-[12px] bg-[#000]/50"
          : "w-[403px] h-[224px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[25px]"
      )}
    >
      <div className="text-white text-[16px] font-[DelaGothicOne]">
        This market has been cancelled
      </div>
      <div className="text-white text-[16px] mt-[40px]">
        The amount of bid has been refunded
      </div>
    </div>
  ) : (
    <div
      className={clsx(
        "rounded-[20px] border border-[#605D55] flex flex-col items-center justify-center",
        isMobile
          ? "w-[calc(100%-24px)] h-[254px] bg-[#000]/50 ml-[12px] mt-[12px]"
          : "w-[403px] h-[224px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[25px]"
      )}
    >
      <div className="text-white text-[16px] font-[DelaGothicOne]">
        This market has been cancelled
      </div>
      <div className="text-white text-[16px] mt-[20px]">
        The amount of bid has been refunded
      </div>
      <div className="text-white text-[16px] mt-[6px]">Your Refund</div>
      <div className="text-white text-[26px] mt-[6px]">
        ${data.user_draw_attempt.times}
      </div>
      {claimed ? (
        <div className="text-[#75FF4A] text-[16px] mt-[10px] flex items-center gap-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <circle cx="11" cy="11" r="11" fill="#75FF4A" />
            <path
              d="M6 11L10 15L17 8"
              stroke="#2B3337"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span>Claimed</span>
        </div>
      ) : (
        <ButtonV2
          className="w-[220px] h-[40px] mt-[10px]"
          loading={claiming}
          onClick={() => onClaim(data.pool_id)}
        >
          Claim
        </ButtonV2>
      )}
    </div>
  );
}
