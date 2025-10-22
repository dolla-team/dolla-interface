import Avatar from "@/components/avatar";
import ItemLevel from "./item-level";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Big from "big.js";

export default function TopWinnersItem({
  data,
  level,
  type
}: {
  data: any;
  level: number;
  type: "winners" | "sellers" | "losers";
}) {
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        `button w-full h-[48px] mt-[5px] px-[10px] relative flex items-center justify-between rounded-[10px] border border-[#F2F2F233] bg-linear-to-r to-[#8C8C8C]/10`,
        level === 1 && "from-[#D565C4]/10",
        level === 2 && "from-[#F87168]/10",
        level === 3 && "from-[#F87168]/10"
      )}
      onClick={() => {
        navigate("/btc/detail/" + data.pool_id);
      }}
    >
      <ItemLevel
        level={level}
        className="absolute top-[-10px] left-[-10px] z-[2]"
      />
      <div className="flex items-center gap-[10px]">
        <div className="w-[40px] h-[40px] p-[2px] rounded-full bg-linear-to-b from-[#FFE093] via-[#FFECBC] to-[#DEAF37]">
          <Avatar
            address={data?.user_info?.user}
            email={data?.user_info?.email_desensitization}
            src={data?.user_info?.icon}
            size={36}
            className="rounded-full text-[18px]"
          />
        </div>
        <div>
          <div className="text-[10px] text-black/30">
            {type === "winners" ? "Winner" : "Seller"}
          </div>
          <div className="text-[12px] text-black font-semibold">
            {data?.user_info?.name || formatAddress(data?.user)}{" "}
          </div>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-black/30 text-right">
          {type === "winners" && "Multiple"}
          {type === "sellers" && "Profit"}
          {type === "losers" && "Loss"}
        </div>
        <div className="text-[12px] text-black text-right font-semibold">
          {type === "winners" && `${formatNumber(data.profit_ratio, 0, true)}%`}
          {type === "sellers" &&
            `$${formatNumber(
              Big(data.claim_amount)
                .div(1e6)
                .minus(data.reward_usd || 0),
              2,
              true
            )}`}
          {type === "losers" &&
            `$${formatNumber(
              Big(data.claim_amount)
                .div(1e6)
                .minus(data.reward_usd || 0)
                .abs(),
              2,
              true
            )}`}
        </div>
      </div>
    </div>
  );
}
