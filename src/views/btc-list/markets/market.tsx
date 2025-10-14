import SellerLevel from "@/components/seller-level";
import columns from "./columns";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import { getReAnchorPrice } from "@/utils/pool";
import ProgressBar from "./progress-bar";
import BtcImg from "./btc-bg";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN, AMOUNT } from "@/config/btc";
import Avatar from "@/components/avatar";
import { getSpilledAmount } from "@/utils/pool";
import { useMemo } from "react";
import MarketStatus from "@/views/profile/components/market-status";
import dayjs from "@/libs/dayjs";

export default function Market({
  data,
  onClick
}: {
  data: any;
  onClick: () => void;
}) {
  const { address } = useAuth();
  const [progress, spilled, spilledPercent] = useMemo(() => {
    return getSpilledAmount(data);
  }, [data]);
  return (
    <div
      onClick={onClick}
      className="relative flex items-center h-[70px] rounded-[10px] bg-[#0000000D] button border border-[#F2F2F233] backdrop-blur-[25px] pl-[14px] pr-[20px]"
    >
      {address?.toLowerCase() === data?.user?.toLowerCase() && (
        <div className="w-[48px] h-[18px] bg-black rounded-b-[12px] absolute top-0 left-0 z-[1] text-[10px] text-white text-center leading-[18px]">
          Yours
        </div>
      )}
      {columns.map((column: any) => (
        <div
          key={column.title}
          className="flex items-center"
          style={{ width: column.width }}
        >
          {column.dataIndex === "pool_id" && (
            <div className="text-[14px] text-black button">{data.pool_id}</div>
          )}
          {column.dataIndex === "market" && (
            <div className="flex items-center gap-[16px]">
              <BtcImg
                index={AMOUNT.indexOf(Number(data.amount))}
                id={data.pool_id}
                amount={data.amount}
              />
              <div>
                <div className="text-[14px] text-black font-semibold">
                  {data.amount} {BASE_TOKEN.symbol}
                  {/* {` #${data.reward_token_info?.[0]?.token_id}`} */}
                </div>
                <div className="flex items-center gap-[4px] mt-[6px]">
                  <Avatar
                    size={10}
                    address={data?.user}
                    src={data?.user_info?.icon}
                    email={data?.user_info?.email_desensitization}
                    className="text-[8px]"
                  />
                  <span className="text-[10px] text-[#2B3337]">
                    {data?.user_info?.name || formatAddress(data?.user)}
                  </span>
                  <SellerLevel isSmall />
                </div>
              </div>
            </div>
          )}
          {column.dataIndex === "anchor_price" && (
            <div className="text-[14px] text-black">
              {formatNumber(getReAnchorPrice(data), 2, true, {
                prefix: "$"
              })}
            </div>
          )}
          {column.dataIndex === "accumulative_bids" && (
            <div className="text-[14px] text-black">
              {formatNumber(data.accumulative_bids, 0, true, {
                prefix: "$"
              })}
            </div>
          )}
          {column.dataIndex === "participants" && (
            <div className="text-[14px] text-black">{data.participants}</div>
          )}
          {column.dataIndex === "hitting" && (
            <div className="w-full">
              {data.progress >= 100 && (
                <div className="text-[#2B3337] text-[12px] mb-[10px] font-[600]">
                  Spilled {formatNumber(spilled, 0, true, { prefix: "$" })}
                </div>
              )}
              <ProgressBar {...{ progress, spilled, spilledPercent }} />
            </div>
          )}
          {column.dataIndex === "status" && (
            <div className="">
              <MarketStatus value={data.status} className="p-[8px]" />
              {data.status === 1 && (
                <div className="text-[10px] text-black mt-[5px]">
                  {dayjs(data.created_at).from(dayjs(Date.now()), true)}
                </div>
              )}
              {data.status === 2 && (
                <div className="flex items-center gap-[4px] mt-[5px]">
                  <Avatar
                    size={20}
                    src={data.winner_user_info?.icon}
                    email={data.winner_user_info?.email_desensitization}
                    address={data.winner_user_info?.user}
                    className="text-[12px]"
                  />
                  <div className="text-[12px] text-black font-[600] w-[160px] truncate">
                    {data.winner_user_info?.name ||
                      formatAddress(data.winner_user_info?.user)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {data.status !== 1 && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#FFFFFF80] border border-[#F2F2F233] rounded-[10px]"></div>
      )}
    </div>
  );
}
