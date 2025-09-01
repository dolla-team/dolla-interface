import clsx from "clsx";
import { useMemo } from "react";
import ProgressBar from "./progress-bar";
import Label from "./label";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import Avatar from "../avatar";
import { formatAddress } from "@/utils/format/address";
import { getAnchorPrice } from "@/utils/pool";

export default function NftCard({
  data,
  className,
  isResult,
  resultContent,
  isSimple,
  onClick
}: any) {
  const [type, rewardToken, tokenPrice, process, returnMultiple] =
    useMemo(() => {
      let _type = "basic";
      if (Number(data?.rare) === 1) _type = "saudi";
      if (Number(data?.rare) === 2) _type = "redOg";
      const _p = Big(data?.accumulative_bids || 0)
        .div(data?.anchor_price || 1)
        .mul(100)
        .toNumber();
      const _price = getAnchorPrice(data?.anchor_price);

      return [_type, data?.reward_token_info?.[0], _price, _p, _price];
    }, [data]);
  return (
    <div
      className={clsx(
        "w-[220px] h-[326px] rounded-[14px] p-[10px] relative border",
        type === "basic" && "border-[#C7C7CC] bg-black/10 backdrop-blur-[10px]",
        type === "saudi" && "border-[#434343CC]",
        type === "redOg" && "border-[#2A2B27]",
        className
      )}
      onClick={onClick}
    >
      {data?.winner_user_info && !isSimple && (
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
      <div className="relative z-[1] w-full">
        <div
          className={clsx(
            "w-full rounded-[10px] p-[2px]",
            type === "basic" && "bg-[#434343CC]"
          )}
        >
          <img
            src={rewardToken?.icon}
            className="rounded-[10px] w-full aspect-square object-cover"
          />
        </div>
        {!isResult && isSimple ? (
          <>
            <div className="text-[20px] font-semibold text-center pt-[20px]">
              {rewardToken?.name}
            </div>
            <div className="text-[26px] font-semibold text-center mt-[4px]">
              {rewardToken?.token_id}
            </div>
          </>
        ) : (
          <>
            <div
              className={clsx(
                "text-[12px] font-semibold flex justify-between items-center mt-[10px]",
                type !== "redOg" ? "text-black" : "text-white"
              )}
            >
              <span>{rewardToken?.name}</span>
              <span>#{rewardToken?.token_id}</span>
            </div>
            <div
              className={clsx(
                "text-[12px] font-semibold flex justify-between items-center",
                type !== "redOg" ? "text-black" : "text-white",
                type === "basic" ? "mt-[8px]" : "mt-[4px]"
              )}
            >
              <span
                className={clsx(
                  "font-normal",
                  type !== "redOg" ? "text-black" : "text-white/60"
                )}
              >
                Prize
              </span>
              {type === "basic" ? (
                <span>
                  {formatNumber(tokenPrice, 2, true, {
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
                  {formatNumber(tokenPrice, 2, true, {
                    prefix: "$"
                  })}
                </div>
              )}
            </div>
            <div
              className={clsx(
                "text-[12px] font-semibold flex justify-between items-center",
                type !== "redOg" ? "text-black" : "text-white",
                type === "basic" ? "mt-[8px]" : "mt-[4px]"
              )}
            >
              <div>
                <span
                  className={clsx(
                    "font-normal",
                    type !== "redOg" ? "text-black" : "text-white/60"
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
                    type !== "redOg" ? "text-black" : "text-white/60"
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
              type !== "redOg" ? "text-black" : "text-white"
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
