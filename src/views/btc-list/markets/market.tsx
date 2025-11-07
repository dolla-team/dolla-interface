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
import MarketStatus from "@/views/profile/components/market-status";
import dayjs from "@/libs/dayjs";
import clsx from "clsx";
import MultipleTag from "@/components/multiple-tag";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";

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
                <div className="text-[14px] mb-[10px] font-[500]">
                  <span
                    className="text-[#2B3337]"
                    style={{
                      background:
                        "linear-gradient(90deg, #BF8B29 0%, #FFA600 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    Overfilled
                  </span>
                  <span className="text-[#22D25D]">
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
          {column.dataIndex === "status" && (
            <LiveInfo data={data}>
              <MarketStatus
                value={data.status}
                className={clsx("p-[8px]", data.status !== 1 && "mx-auto")}
              />
            </LiveInfo>
          )}
        </div>
      ))}
      {data.status === 2 && (
        <MultipleTag
          multipler={formatNumber(data.winner_profit_ratio, 0, true)}
          size={47}
          className="absolute top-[-4px] right-[-4px] z-[2]"
          textClassName="text-[14px]"
        />
      )}
    </div>
  );
}

const LiveInfo = ({
  children,
  data
}: {
  children: React.ReactNode;
  data: any;
}) => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[230px] px-[15px] py-[10px] text-[12px] p-[14px] bg-white rounded-[10px] border border-[#E4E4E4]">
          {data.status === 1 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#5E6B7D]">Created</span>
                <span className="text-black">
                  {dayjs(data.created_at).format("YYYY-MM-DD HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between mt-[6px]">
                <span className="text-[#5E6B7D]">Lasts</span>
                <span className="text-black">
                  {dayjs(data.created_at).from(dayjs(Date.now()), true)}
                </span>
              </div>
            </>
          )}
          {data.status === 2 && (
            <>
              <div className="flex items-center justify-between w-full">
                <span className="text-[#5E6B7D]">Winner</span>
                <div className="flex items-center justify-end gap-[4px] mt-[5px]">
                  <Avatar
                    size={20}
                    src={data.winner_user_info?.icon}
                    email={data.winner_user_info?.email_desensitization}
                    address={data.winner_user_info?.user}
                    className="text-[12px]"
                  />
                  <div className="text-[12px] text-black font-[600]">
                    {data.winner_user_info?.name ||
                      formatAddress(
                        data.winner_user_info?.user || data?.winner_user
                      )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-[6px]">
                <span className="text-[#5E6B7D]">Duration</span>
                <div className="text-black text-right">
                  <div>{dayjs(data.created_at).format("YYYY-MM-DD HH:mm")}</div>
                  <div>
                    ~{dayjs(data.result_time).format("YYYY-MM-DD HH:mm")}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-[6px]">
                <span className="text-[#5E6B7D]">Lasts</span>
                <div className="text-black">
                  {data?.created_at && data?.result_time
                    ? dayjs(data.created_at).from(dayjs(data.result_time), true)
                    : "-"}
                </div>
              </div>
            </>
          )}
        </div>
      }
    >
      {children}
    </Popover>
  );
};
