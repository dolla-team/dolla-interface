import clsx from "clsx";
import { useMemo } from "react";
import ProgressBar from "./progress-bar";
import Label from "./label";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import Avatar from "../avatar";
import { formatAddress } from "@/utils/format/address";
import { getAnchorPrice } from "@/utils/pool";
import BtcImg from "./btc";

export default function NftCard({
  data,
  className,
  onClick,
  isNft = true,
  isResult = false
}: any) {
  const [type, rewardToken, tokenPrice, process, returnMultiple, amount] =
    useMemo(() => {
      let _type = "basic";
      if (Number(data?.rare) === 1) _type = "saudi";
      if (Number(data?.rare) === 2) _type = "redOg";
      const _p = Big(data?.accumulative_bids || 0)
        .div(data?.anchor_price || 1)
        .mul(100)
        .toNumber();
      const _price = getAnchorPrice(data?.anchor_price);
      const reward_amount = data.reward_amount || 0;
      const decimals = data.reward_token_info?.[0]?.decimals || 1;
      const _an = Big(reward_amount).div(10 ** decimals);
      const _a = formatNumber(_an, 3, true);

      return [_type, data?.reward_token_info?.[0], _price, _p, _price, _a];
    }, [data]);
  return (
    <div
      className={clsx(
        "w-[220px] h-[314px] rounded-[14px] p-[10px] relative border border-[#00000033]",
        isNft ? "bg-[#0000000D]" : "bg-linear-to-b from-[#FFFFFF] to-[#FFE9A6]",
        className
      )}
      onClick={onClick}
    >
      {data?.winner_user_info && (
        <div className="w-full h-full rounded-[12px] absolute top-0 left-0 z-[10] bg-[#00000080]">
          <div className="flex justify-center mt-[100px]">
            <div className="p-[2px] pr-[10px] min-w-[100px] inline-flex gap-[3px] rounded-[12px] bg-[#FFFFFF1A] backdrop-blur-[10px]">
              <Avatar address={data.winner_user_info?.user} size={24} />
              <span className="text-[12px] font-semibold text-white">
                {data.winner_user_info?.name ||
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

      {isNft && <Label type={type} id={data?.id} />}

      <div className="relative z-[1] w-full flex flex-col items-center">
        {isNft ? (
          <div className={clsx("w-full rounded-[10px] p-[2px]")}>
            <img
              src={rewardToken?.icon}
              className="rounded-[10px] w-full aspect-square object-cover"
            />
          </div>
        ) : (
          <BtcImg amount={amount} />
        )}
        <>
          <div
            className={clsx("text-[12px] font-semibold mt-[10px] text-black")}
          >
            {isNft ? (
              <>
                <span>{rewardToken?.name}</span>
                <span> {rewardToken?.token_id}</span>
              </>
            ) : (
              <span>{amount} BTC Market</span>
            )}
          </div>
          <div
            className="mt-[4px] rounded-[10px] text-black inline-block px-[12px] py-[2px] text-[20px] font-semibold"
            style={{
              background: "linear-gradient(90deg, #FFE9B2 0%, #FFC42F 100%)"
            }}
          >
            🔥
            {formatNumber(tokenPrice, 2, true, {
              prefix: "$"
            })}
          </div>
          <ProgressBar
            type={type}
            progress={process}
            className="mt-[10px]"
            isNft={isNft}
          />
        </>
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
