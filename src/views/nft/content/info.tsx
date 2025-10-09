import { useNftContext } from "../context";
import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import SellerLevel from "@/components/seller-level";
import BidSelection from "./bid-selection";
import Probability from "./probability";
import dayjs from "@/libs/dayjs";
import { formatNumber } from "@/utils/format/number";
import { getAnchorPrice } from "@/utils/pool";
import Button from "@/components/button";
import RandomlyNft from "./randomly-nft";
import { useAuth } from "@/contexts/auth";

export default function Info({
  disabled,
  onBidClick,
  probability,
  probabilities,
  rewardTokenInfo
}: any) {
  const { pool } = useNftContext();
  const { nearAccount } = useAuth();

  return (
    <div>
      <div className="text-[32px] font-bold">
        {rewardTokenInfo.name} {rewardTokenInfo.token_id}
      </div>
      <div className="flex items-center gap-[10px] text-[14px]">
        <span className="text-[#8A87AA]">Collection: </span>
        <span className="text-[#2B3337]">{rewardTokenInfo.name}</span>
      </div>
      <div className="flex items-center gap-[12px] mt-[10px]">
        <Avatar
          size={40}
          address={pool?.user_info?.address}
          email={pool?.user_info?.show_email}
          src={pool?.user_info?.icon}
          className="rounded-[10px] border-[2px] border-white"
        />
        <div>
          <div>
            <span className="text-[14px] text-[#8A87AA]">Seller</span>
          </div>
          <div className="flex items-center gap-[4px]">
            <span className="text-[16px] text-[#2B3337]">
              {pool?.user ? formatAddress(pool.user) : "-"}
            </span>
            <SellerLevel />
          </div>
        </div>
      </div>
      <div className="mt-[6px] text-[14px]">
        <span className="text-[#8A87AA]">Date: </span>
        <span className="text-[#2B3337]">
          {dayjs(pool?.created_at).format("YYYY/DD/MM")}{" "}
        </span>
        <span className="text-[#3CBF13]">
          (Lasting {dayjs(pool?.created_at).fromNow(true)})
        </span>
      </div>
      <div className="flex gap-[16px] mt-[20px]">
        {["Valued", "Players", "Bid"].map((item) => (
          <div
            key={item}
            className="w-[282px] h-[96px] rounded-[16px] border border-[#E4E4E4] bg-[#FFFFFF99] backdrop-blur-[10px] flex flex-col justify-center items-center"
          >
            <div className="text-[14px] text-[#8A87AA]">{item}</div>
            <div className="text-[20px] text-[#2B3337]">
              {item === "Valued" && (
                <div
                  className="text-[20px] font-bold"
                  style={{
                    background:
                      "linear-gradient(90deg, #DAA92F 0%, #AF8D36 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {formatNumber(getAnchorPrice(pool?.anchor_price), 3, true, {
                    prefix: "$"
                  })}
                </div>
              )}
              {item === "Players" && <div>{pool?.participants}</div>}
              {item === "Bid" && (
                <div>
                  {formatNumber(pool?.accumulative_bids || 0, 3, true, {
                    prefix: "$"
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[20px] w-[876px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF99] p-[24px] flex items-center">
        <div className="mr-[30px]">
          <div className="text-[14px] text-[#8A87AA]">
            Your Bal.{" "}
            {formatNumber(nearAccount?.balance || 0, 3, true, {
              prefix: "$"
            })}
          </div>
          <BidSelection disabled={disabled} />
        </div>
        <Probability probability={probability} probabilities={probabilities} />
        <Button
          className="ml-[50px] mt-[20px] h-[66px] w-[116px] bg-[#6F37FF] text-[20px] font-[900] text-white"
          isPrimary={false}
          disabled={disabled}
          onClick={onBidClick}
        >
          BID
        </Button>
      </div>
      <RandomlyNft />
    </div>
  );
}
