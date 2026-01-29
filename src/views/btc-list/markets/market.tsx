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
import { useMemo, useRef, useEffect, useState } from "react";
import dayjs from "@/libs/dayjs";
import clsx from "clsx";
import LevelIcon from "@/components/icons/level-icon";
import AnimatedCounter from "@/components/animated-counter";
import { motion, AnimatePresence } from "framer-motion";

// Format relative time to short format (e.g., "9 days" -> "9d", "5 months" -> "5m")
export function formatRelativeTime(
  date: string | number | Date,
  compareDate?: string | number | Date,
  isShort?: boolean
): string {
  const start = dayjs(date)
  const end = compareDate ? dayjs(compareDate) : dayjs()
  const diffSeconds = end.diff(start, 'second')
  const diffMinutes = end.diff(start, 'minute')
  const diffHours = end.diff(start, 'hour')
  const diffDays = end.diff(start, 'day')
  const diffMonths = end.diff(start, 'month')
  const diffYears = end.diff(start, 'year')

  if (diffYears > 0) return isShort ? `${diffYears}y` : `${diffYears} years`
  if (diffMonths > 0) return isShort ? `${diffMonths}m` : `${diffMonths} months`
  if (diffDays > 0) return isShort ? `${diffDays}d` : `${diffDays} days`
  if (diffHours > 0) return isShort ? `${diffHours}h` : `${diffHours} hours`
  if (diffMinutes > 0) return isShort ? `${diffMinutes}min` : `${diffMinutes} minutes`

  return isShort ? `${diffSeconds}s` : `${diffSeconds} seconds`
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

  // Track accumulative_bids changes to trigger shine effect
  const prevAccumulativeBidsRef = useRef<number | undefined>(
    data.accumulative_bids
  );
  const [showShine, setShowShine] = useState(false);

  useEffect(() => {
    const currentBids = data.accumulative_bids;
    const prevBids = prevAccumulativeBidsRef.current;

    setShowShine(false);
    clearTimeout(window.shineTimer);

    if (prevBids !== undefined && currentBids !== prevBids) {
      setShowShine(true);
      // Hide shine after animation completes
      window.shineTimer = setTimeout(() => {
        setShowShine(false);
      }, 6000);
    }

    prevAccumulativeBidsRef.current = currentBids;
  }, [data.accumulative_bids]);
  return (
    <div
      onClick={onClick}
      className="relative h-[70px] button rounded-[10px] bg-[#0000000D] border border-[#F2F2F233] overflow-hidden"
      style={{
        background: bgColor,
      }}
    >
      <AnimatePresence>
        {showShine && (
          <motion.div
            className="absolute top-0 left-0 w-1/2 z-[1] h-full rounded-[10px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 30%, rgba(255, 166, 0, 0.5) 50%, transparent 70%)',
            }}
            initial={{
              x: -200,
            }}
            animate={{
              x: 1200,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 2,
              repeat: 2,
              repeatType: 'loop',
              ease: 'linear',
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-[2] flex items-center h-full pl-[14px] pr-[20px]">
        {address?.toLowerCase() === data?.user?.toLowerCase() && (
          <div className="w-[48px] h-[18px] bg-black rounded-b-[12px] absolute top-0 left-0 z-[1] text-[10px] text-white text-center leading-[18px]">
            Yours
          </div>
        )}
        {columns.map((column: any) => (
          <div
            key={column.title}
            className={clsx(
              'flex items-center',
              column.align === 'center' && 'justify-center',
              column.align === 'right' && 'justify-end'
            )}
            style={{ width: column.width }}
          >
            {column.dataIndex === 'pool_id' && (
              <div className="text-[14px] text-black button">{data.pool_id}</div>
            )}
            {column.dataIndex === 'live' && (
              <div className="text-[14px] text-black">
                {formatRelativeTime(data.created_at, dayjs().toDate(), true)}
              </div>
            )}
            {column.dataIndex === 'lasted' && (
              <div className="text-[14px] text-black">
                {formatRelativeTime(data.created_at, data.result_time, true)}
              </div>
            )}
            {column.dataIndex === 'market' && (
              <div className="flex items-center gap-[16px]">
                <BtcImg index={amountIndex} id={data.pool_id} amount={data.amount} />
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
            {column.dataIndex === 'anchor_price' && (
              <div
                className={clsx('text-[14px]', amountIndex !== 2 && 'font-[500]')}
                style={{
                  background:
                    amountIndex === 0
                      ? 'linear-gradient(90deg, #BF8B29 0%, #FFA600 100%)'
                      : amountIndex === 1
                        ? 'linear-gradient(90deg, #717A8D 0%, #7282B9 23.56%, #ACA1C4 100%)'
                        : '#000',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatNumber(data?.reward_usd || 0, 1, true, {
                  prefix: '$',
                })}
              </div>
            )}
            {column.dataIndex === 'accumulative_bids' &&
              (data?.status === 1 ? (
                <AnimatedCounter
                  value={data.accumulative_bids}
                  prefix="$"
                  className="text-[14px] text-black"
                />
              ) : (
                <div className="text-[14px] text-black">
                  {formatNumber(data.accumulative_bids, 0, true, {
                    prefix: '$',
                  })}
                </div>
              ))}
            {column.dataIndex === 'participants' && (
              <div className="text-[14px] text-black">{data.participants}</div>
            )}
            {column.dataIndex === 'hitting' && (
              <div className="w-full">
                {spilled > 0 ? (
                  <div className="text-[14px] font-[500]">
                    <span
                      className="text-[#2B3337]"
                      style={{
                        background:
                          data.status === 1
                            ? 'linear-gradient(90deg, #BF8B29 0%, #FFA600 100%)'
                            : '#8A87AA',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Overfilled
                    </span>
                    <span className={clsx(data.status === 1 ? 'text-[#22D25D]' : 'text-[#8A87AA]')}>
                      {' '}
                      +{formatNumber(spilled, 0, true, { prefix: '$' })}
                    </span>
                  </div>
                ) : (
                  <ProgressBar
                    {...{
                      progress,
                      spilled,
                      spilledPercent,
                      status: data.status,
                    }}
                  />
                )}
              </div>
            )}
            {column.dataIndex === 'winner' && (
              <div className="flex items-center justify-end gap-[8px]">
                <div className="relative shrink-0">
                  <Avatar
                    size={30}
                    src={data.winner_user_info?.icon}
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
                    {data.winner_user_info?.name || formatAddress(data.winner_user_info?.user)}
                  </div>
                  <div
                    className={clsx('text-[14px] font-[500]')}
                    style={{
                      color: textColor,
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
    </div>
  )
}
