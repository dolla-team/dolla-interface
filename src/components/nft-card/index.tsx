import clsx from "clsx";
import { useMemo } from "react";
import ProgressBar from "./progress-bar";
import Label from "./label";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import Avatar from "../avatar";
import { formatAddress } from "@/utils/format/address";

export default function NftCard({
  data,
  className,
  isResult,
  resultContent
}: any) {
  const [type, rewardToken, rewardTokenPrice, process, returnMultiple] =
    useMemo(() => {
      let _type = "basic";
      if (Number(data?.rare) === 1) _type = "saudi";
      if (Number(data?.rare) === 2) _type = "redOg";
      const _p = Big(data?.accumulative_bids || 0)
        .div(data?.anchor_price || 1)
        .mul(100)
        .toNumber();

      return [
        _type,
        data?.reward_token_info?.[0],
        data?.reward_token_price,
        _p,
        0
      ];
    }, [data]);
  return (
    <div
      className={clsx(
        "w-[220px] h-[326px] rounded-[12px] p-[10px] relative border",
        type === "basic" && "border-[#3B3951] bg-white/10 backdrop-blur-[10px]",
        type === "saudi" && "border-[#434343CC]",
        type === "redOg" && "border-[#2A2B27]",
        className
      )}
    >
      {data?.winner_user_info && (
        <div className="w-full h-full rounded-[12px] absolute top-0 left-0 z-[10] bg-[#00000080]">
          <div className="flex justify-center mt-[100px]">
            <div className="p-[2px] pr-[10px] min-w-[100px] inline-flex gap-[3px] rounded-[12px] bg-[#FFFFFF1A] backdrop-blur-[10px]">
              <Avatar
                address={data.winner_user_info?.user}
                email={data.winner_user_info?.email}
                size={24}
              />
              <span className="text-[12px] font-semibold text-white">
                {data.winner_user_info?.email ||
                  formatAddress(data.winner_user_info?.user)}
              </span>
            </div>
          </div>
          <div
            className="text-[26px] font-bold text-center mt-[4px]"
            style={{
              background: "linear-gradient(180deg, #FFF79F 0%, #D3C104 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {formatNumber(returnMultiple, 0, true, { isShort: true })}x WIN
          </div>
        </div>
      )}
      {isResult && resultContent}
      {!isResult && <Label type={type} id={data?.id} />}

      {type === "saudi" && (
        <div className="w-full h-full bg-[url('/nft/saudi-bg.png')] bg-cover bg-center absolute top-0 left-0" />
      )}
      {type === "redOg" && (
        <div className="w-full h-full bg-[url('/nft/redOg-bg.png')] bg-cover bg-center absolute top-0 left-0" />
      )}
      <div className="relative z-[1]">
        <div
          className={clsx(
            "w-[200px] h-[200px] rounded-[10px] p-[2px]",
            type === "basic" && "bg-[#434343CC]"
          )}
        >
          <img
            src={rewardToken?.icon}
            className="w-[196px] h-[196px] rounded-[10px]"
          />
        </div>
        {!isResult && (
          <>
            <div
              className={clsx(
                "text-[12px] font-semibold flex justify-between items-center mt-[10px]",
                type === "saudi" ? "text-black" : "text-white"
              )}
            >
              <span>{rewardToken?.name}</span>
              <span>#{rewardToken?.token_id}</span>
            </div>
            <div
              className={clsx(
                "text-[12px] font-semibold flex justify-between items-center",
                type === "saudi" ? "text-black" : "text-white",
                type === "basic" ? "mt-[8px]" : "mt-[4px]"
              )}
            >
              <span
                className={clsx(
                  "font-normal",
                  type === "saudi" ? "text-black" : "text-white/60"
                )}
              >
                Prize
              </span>
              {type === "basic" ? (
                <span>
                  {formatNumber(rewardTokenPrice?.last_price, 2, true, {
                    prefix: "$"
                  })}
                </span>
              ) : (
                <div
                  className="p-[5px] rounded-[6px] text-black"
                  style={{
                    background:
                      "linear-gradient(90deg, #FFE9B2 0%, #FFC42F 100%)"
                  }}
                >
                  🔥
                  {formatNumber(rewardTokenPrice?.last_price, 2, true, {
                    prefix: "$"
                  })}
                </div>
              )}
            </div>
            <div
              className={clsx(
                "text-[12px] font-semibold flex justify-between items-center",
                type === "saudi" ? "text-black" : "text-white",
                type === "basic" ? "mt-[8px]" : "mt-[4px]"
              )}
            >
              <div>
                <span
                  className={clsx(
                    "font-normal",
                    type === "saudi" ? "text-black" : "text-white/60"
                  )}
                >
                  Players
                </span>{" "}
                <span>{data?.participants}</span>
              </div>
              <div>
                <span
                  className={clsx(
                    "font-normal",
                    type === "saudi" ? "text-black" : "text-white/60"
                  )}
                >
                  Bid
                </span>{" "}
                <span>
                  {formatNumber(data?.accumulative_bids, 0, true, {
                    prefix: "$"
                  })}
                </span>
              </div>
            </div>
            <ProgressBar type={type} progress={process} className="mt-[10px]" />
          </>
        )}
        {isResult && (
          <div
            className={clsx(
              "text-center text-black flex flex-col justify-center h-[100px]",
              type === "saudi" ? "text-black" : "text-white"
            )}
          >
            <div className="text-[18px] font-bold">Congrats!</div>
            <div className="text-[12px] font-semibold">
              You won <span className="text-[14px]">{rewardToken?.name}</span>{" "}
              <span className="text-[14px]">#{rewardToken?.token_id}</span> by
              only <span className="text-[14px]">$1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
