import Button from "@/components/button";
import { useBtcContext } from "@/views/btc/context";
import useRefund from "@/hooks/near/use-player-refund";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function Cancel() {
  const { pool } = useBtcContext();
  const { loading: claiming, refund: onClaim } = useRefund(
    pool?.pool_id,
    () => {
      setClaimed(true);
    }
  );
  const [claimed, setClaimed] = useState<boolean | null>(null);
  useEffect(() => {
    setClaimed(pool.user_draw_attempt?.status === 4);
  }, [pool]);
  return (
    <div className="mx-[12px] mt-[12px] rounded-[10px] bg-black py-[14px] px-[18px] flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={clsx(claimed && "opacity-50")}
      >
        <path
          d="M11.9453 6.16113C12.0963 6.16115 12.2456 6.19306 12.3838 6.25391C12.5213 6.31222 12.6472 6.3955 12.7539 6.5L17.375 11.1211C17.606 11.3521 17.7139 11.6449 17.7139 11.9375C17.7139 12.2301 17.606 12.5229 17.375 12.7539C16.9283 13.2006 16.1889 13.2005 15.7422 12.7539L13.1084 10.1201V22.7197C13.1084 23.3512 12.5846 23.8749 11.9531 23.875C11.3216 23.875 10.7979 23.3513 10.7979 22.7197V10.1045L8.14844 12.7539C7.70176 13.2006 6.96232 13.2006 6.51562 12.7539C6.06893 12.3072 6.06893 11.5678 6.51562 11.1211L11.1367 6.5C11.2444 6.39236 11.3675 6.31546 11.5059 6.25391C11.6442 6.19297 11.7942 6.16113 11.9453 6.16113ZM11.9375 0C18.5147 1.61929e-07 23.875 5.36032 23.875 11.9375C23.8658 14.1943 23.2205 16.4026 22.0137 18.3096C20.8068 20.2165 19.0873 21.7453 17.0518 22.7197C16.4664 22.9816 15.788 22.735 15.5107 22.165C15.2491 21.5952 15.4957 20.9023 16.0654 20.625C19.4079 19.0385 21.5645 15.6186 21.5645 11.9219C21.5643 6.60786 17.2515 2.29492 11.9375 2.29492C6.62346 2.29492 2.31067 6.60786 2.31055 11.9219C2.3155 13.7429 2.83391 15.5259 3.80664 17.0654C4.77938 18.6049 6.16704 19.8387 7.80957 20.625C8.39469 20.9023 8.62589 21.5952 8.36426 22.165C8.087 22.7504 7.40856 22.997 6.82324 22.7197C2.67996 20.7634 1.16006e-07 16.5275 0 11.9375C0 5.36032 5.36032 0 11.9375 0Z"
          fill="#FFC42F"
        />
      </svg>
      <span
        className={clsx(
          "ml-[14px] text-[12px] text-[#FFC42F]",
          claimed && "opacity-50"
        )}
      >
        This market has been cancelled, claim your bid fund.
      </span>
      {claimed ? (
        <div className="flex items-center gap-[4px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
          >
            <path
              d="M1 4L5.5 8.5L13 1"
              stroke="#7FFF6E"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[12px] text-[#7FFF6E]">Claimed</span>
        </div>
      ) : (
        <Button
          loading={claiming}
          onClick={() => onClaim()}
          className="!w-[70px] !h-[34px] !rounded-[12px] !bg-[#FFC42F] shrink-0"
        >
          Claim
        </Button>
      )}
    </div>
  );
}
