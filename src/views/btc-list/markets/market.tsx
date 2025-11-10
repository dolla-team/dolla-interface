import SellerLevel from "@/components/seller-level";
import { liveColumns, soldColumns } from "./columns";
import { formatAddress } from "@/utils/format/address";
import { formatNumber } from "@/utils/format/number";
import ProgressBar from "./progress-bar";
import BtcImg from "./btc-bg";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN, AMOUNT } from "@/config/btc";
import Avatar from "@/components/avatar";
import { getSpilledAmount } from "@/utils/pool";
import { useMemo } from "react";
import dayjs from "@/libs/dayjs";
import clsx from "clsx";
import LevelIcon from "@/components/icons/level-icon";

// Format relative time to short format (e.g., "9 days" -> "9d", "5 months" -> "5m")
function formatRelativeTime(
  date: string | number | Date,
  compareDate?: string | number | Date
): string {
  const start = dayjs(date);
  const end = compareDate ? dayjs(compareDate) : dayjs();
  const diffSeconds = end.diff(start, "second");
  const diffMinutes = end.diff(start, "minute");
  const diffHours = end.diff(start, "hour");
  const diffDays = end.diff(start, "day");
  const diffMonths = end.diff(start, "month");
  const diffYears = end.diff(start, "year");

  if (diffYears > 0) return `${diffYears}y`;
  if (diffMonths > 0) return `${diffMonths}m`;
  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  if (diffMinutes > 0) return `${diffMinutes}min`;
  return `${diffSeconds}s`;
}

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
  const amountIndex = AMOUNT.indexOf(Number(data.amount));
  const columns = useMemo(() => {
    return data.status === 1 ? liveColumns : soldColumns;
  }, [data.status]);
  const [bgColor, textColor] = useMemo(() => {
    const profitRatio = Number(data.winner_profit_ratio);
    if (!profitRatio) return ["", ""];
    if (data.winner_profit_ratio > 1000) {
      return [
        "linear-gradient(90deg, rgba(255, 161, 0, 0.00) 87.09%, rgba(255, 161, 0, 0.20) 100%), rgba(0, 0, 0, 0.03)",
        "#FFA100"
      ];
    }
    if (data.winner_profit_ratio > 100) {
      return [
        "linear-gradient(90deg, rgba(162, 119, 255, 0.00) 87.09%, rgba(162, 119, 255, 0.20) 100%), rgba(0, 0, 0, 0.03)",
        "#A277FF"
      ];
    }
    return [
      "linear-gradient(90deg, rgba(34, 210, 93, 0.00) 87.09%, rgba(34, 210, 93, 0.20) 100%), rgba(0, 0, 0, 0.03)",
      "#ACA1C4"
    ];
  }, [data.winner_profit_ratio]);
  return (
    <div
      onClick={onClick}
      className="relative flex items-center h-[70px] rounded-[10px] bg-[#0000000D] button border border-[#F2F2F233] backdrop-blur-[25px] pl-[14px] pr-[20px]"
      style={{
        background: bgColor
      }}
    >
      {address?.toLowerCase() === data?.user?.toLowerCase() && (
        <div className="w-[48px] h-[18px] bg-black rounded-b-[12px] absolute top-0 left-0 z-[1] text-[10px] text-white text-center leading-[18px]">
          Yours
        </div>
      )}
      {columns.map((column: any) => (
        <div
          key={column.title}
          className={clsx(
            "flex items-center",
            column.align === "center" && "justify-center",
            column.align === "right" && "justify-end"
          )}
          style={{ width: column.width }}
        >
          {column.dataIndex === "pool_id" && (
            <div className="text-[14px] text-black button">{data.pool_id}</div>
          )}
          {column.dataIndex === "live" && (
            <div className="text-[14px] text-black">
              {formatRelativeTime(data.created_at)}
            </div>
          )}
          {column.dataIndex === "lasted" && (
            <div className="text-[14px] text-black">
              {formatRelativeTime(data.created_at, data.result_time)}
            </div>
          )}
          {column.dataIndex === "market" && (
            <div className="flex items-center gap-[16px]">
              <BtcImg
                index={amountIndex}
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
            <div
              className={clsx("text-[14px]", amountIndex !== 2 && "font-[500]")}
              style={{
                background:
                  amountIndex === 0
                    ? "linear-gradient(90deg, #BF8B29 0%, #FFA600 100%)"
                    : amountIndex === 1
                    ? "linear-gradient(90deg, #717A8D 0%, #7282B9 23.56%, #ACA1C4 100%)"
                    : "#000",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {formatNumber(data?.reward_usd || 0, 1, true, {
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
              {spilled > 0 ? (
                <div className="text-[14px] font-[500]">
                  <span
                    className="text-[#2B3337]"
                    style={{
                      background:
                        data.status === 1
                          ? "linear-gradient(90deg, #BF8B29 0%, #FFA600 100%)"
                          : "#8A87AA",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    Overfilled
                  </span>
                  <span
                    className={clsx(
                      data.status === 1 ? "text-[#22D25D]" : "text-[#8A87AA]"
                    )}
                  >
                    {" "}
                    +{formatNumber(spilled, 0, true, { prefix: "$" })}
                  </span>
                </div>
              ) : (
                <ProgressBar
                  {...{
                    progress,
                    spilled,
                    spilledPercent,
                    status: data.status
                  }}
                />
              )}
            </div>
          )}
          {column.dataIndex === "winner" && (
            <div className="flex items-center justify-end gap-[8px]">
              <div className="relative shrink-0">
                <Avatar
                  size={30}
                  src={data.winner_user_info?.icon}
                  email={data.winner_user_info?.email_desensitization}
                  address={data.winner_user_info?.user}
                  className="rounded-full"
                />
                <div className="flex items-center absolute bottom-[-10px] left-0 z-[2]">
                  <LevelIcon size={15} className="relative z-[2]" />
                  <span className="ml-[-14px] pl-[16px] pr-[6px] text-[8px] text-right text-white border border-white bg-[#3C3C3C] rounded-[12px]">
                    {data.winner_user_info?.level}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[14px] text-black w-[100px] truncate">
                  {data.winner_user_info?.name ||
                    formatAddress(data.winner_user_info?.user)}
                </div>
                <div
                  className={clsx("text-[14px] font-[500]")}
                  style={{
                    color: textColor
                  }}
                >
                  {formatNumber(data.winner_profit_ratio, 0, true)}x
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
