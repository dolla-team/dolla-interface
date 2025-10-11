import clsx from "clsx";
import { motion } from "framer-motion";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import { getReAnchorPrice } from "@/utils/pool";
import useIsMobile from "@/hooks/use-is-mobile";
import { formatAddress } from "@/utils/format/address";
import Avatar from "@/components/avatar";
import BtcImg from "@/views/btc-list/markets/btc-bg";
import MarketStatus from "../market-status";

export default function Market({
  data,
  className,
  footer,
  header,
  from,
  onClick,
  isActive
}: {
  data: any;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isAcitveBg?: boolean;
  from?: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  const [progress, anchorPrice] = useMemo(() => {
    if (data?.anchor_price === "0") return [0, 0];
    const _anchorPrice = getReAnchorPrice(data);

    return [(data.accumulative_bids / _anchorPrice) * 100, _anchorPrice];
  }, [data]);

  const isMobile = useIsMobile();
  const amount = String(
    data.reward_amount / 10 ** data.reward_token_info?.[0].decimals
  );

  return (
    <div
      className={clsx(
        "w-[300px] group shrink-0 rounded-[20px] border-[1px] border-[#E4E4E4] bg-black transition-all duration-300 relative",
        isActive
          ? "shadow-[0px_0px_20px_0px_rgba(255,_239,_67,_0.60)] bg-[url('/btc/bg-market-active-border.svg')] bg-[length:344px_222px] bg-no-repeat bg-center"
          : "",
        isMobile
          ? ""
          : onClick &&
              "cursor-pointer hover:scale-[1.05] hover:shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)]",
        className
      )}
      onClick={onClick}
    >
      {header}
      <div className="relative z-[2] bg-white rounded-[18px] pt-[20px]">
        <div className="flex items-center justify-between px-[12px]">
          <div className="flex items-center gap-[12px]">
            {data?.reward_amount && (
              <BtcImg
                amount={amount}
                id={data?.pool_id}
                name={data.reward_token_info?.[0]?.symbol}
              />
            )}
            <div>
              <div className="text-[18px] text-[#2B3337] font-bold">
                {amount} {data.reward_token_info?.[0]?.symbol}
              </div>
              <div className="flex items-center gap-[6px]">
                <Avatar
                  size={20}
                  src={data?.pool_user_info?.icon}
                  email={data?.pool_user_info?.email_desensitization}
                  address={data?.pool_user_info?.user}
                  className="text-[12px]"
                />
                <div className="text-[12px]">
                  {formatAddress(data?.pool_user_info?.user)}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#5E6B7D] text-right mb-[4px]">
              #{data?.pool_id}
            </div>
            <MarketStatus value={data?.status} market={data} />
          </div>
        </div>

        <div
          className={clsx(
            "px-[12px] flex items-center justify-between text-[12px]",
            isActive
              ? "mt-[23px] font-[DelaGothicOne] text-[#FFE9B2]"
              : "mt-[16px]"
          )}
        >
          <div className="flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
            >
              <path
                d="M6.86523 0.00292969C8.86676 0.0516192 10.4624 0.659753 11.6514 1.82715C12.8403 2.99454 13.412 4.52007 13.3662 6.40332C13.3213 8.24703 12.6766 9.72293 11.4326 10.8311C10.9282 11.2803 10.3602 11.6325 9.73145 11.8916C11.3337 12.6931 11.9803 14.106 12.0361 14.9434C12.0066 14.9621 10.1901 16.1045 6.8252 16.1045C3.43269 16.1044 1.80176 14.9434 1.80176 14.9434C1.96364 14.1342 2.5346 12.7876 3.98535 11.9746C3.12255 11.6699 2.36646 11.2109 1.71875 10.5947C0.530048 9.42739 -0.0419363 7.92196 0.00292969 6.07812C0.048768 4.19487 0.694169 2.69902 1.93848 1.59082C3.2219 0.483811 4.86405 -0.0456682 6.86523 0.00292969Z"
                fill="#5E6B7D"
              />
              <path
                d="M4.26941 3.96143L4.26941 5.61024"
                stroke="white"
                strokeLinecap="round"
              />
              <path
                d="M9.82027 4.29053L8.22718 4.71727"
                stroke="white"
                strokeLinecap="round"
              />
              <path
                d="M4.43509 8.08337C5.75452 8.90778 8.5583 8.7429 9.87772 6.9292"
                stroke="white"
                strokeLinecap="round"
              />
            </svg>
            <span
              className={clsx(
                "",
                isActive ? "text-[#FFE9B2]" : "text-[#ADBCCF]"
              )}
            >
              {data?.participants}
            </span>
          </div>
          <div className="flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
            >
              <path
                d="M12.8975 12.0449C12.9037 12.6813 9.87782 14 6.36328 14C2.8488 14 0 12.7272 0 12.0908L0.00585938 10.1816C0.723974 10.6059 2.99593 11.4541 6.36328 11.4541C9.73069 11.4541 12.1793 10.818 12.8975 10.1816V12.0449ZM12.8975 7.59082C12.9035 8.2272 9.87775 9.5459 6.36328 9.5459C2.84937 9.54587 0.000930709 8.27318 0 7.63672L0.00585938 5.72754C0.723974 6.15178 2.99593 6.99998 6.36328 7C9.7304 7 12.1791 6.36385 12.8975 5.72754V7.59082ZM6.37012 0C9.88453 5.75454e-05 12.7334 1.14012 12.7334 2.5459C12.7328 3.95147 9.88416 5.09076 6.37012 5.09082C2.85595 5.09082 0.0064589 3.95151 0.00585938 2.5459C0.00585938 1.14008 2.85558 0 6.37012 0Z"
                fill="#5E6B7D"
              />
            </svg>
            <span
              className={clsx(
                "",
                isActive ? "text-[#FFE9B2]" : "text-[#ADBCCF]"
              )}
            >
              {formatNumber(data?.accumulative_bids || 0, 0, true, {
                prefix: "$"
              })}
            </span>
          </div>
        </div>
        <div
          className={clsx(
            "mt-[10px] rounded-[6px] relative mx-[11px]",
            isActive
              ? "h-[6px] bg-white/10 border border-[#948254]"
              : "h-[3px] bg-[#191E27]"
          )}
        >
          <div
            className="h-full absolute left-0 top-0 rounded-[6px] shadow-[0px_0px_6px_0px_#FFC42F]"
            style={{
              background:
                progress >= 100
                  ? "linear-gradient(270deg, #FFC42F 0%, #FF43E0 54.81%, #53EABF 100%)"
                  : "linear-gradient(90deg, #6F37FF 0%, #00FFBB 100%)",
              width: `${Math.min(progress, 100)}%`
            }}
          >
            {progress >= 80 && progress < 100 && (
              <>
                <motion.div
                  className="absolute right-0 top-[-3px] w-[4px] h-[2px] bg-[#FFC42F] rounded-full rotate-45"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [-2, -16, -2],
                    opacity: [1, 0.6, 1]
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                />
                <motion.div
                  className="absolute right-0 bottom-[-3px] w-[4px] h-[2px] bg-[#FFC42F] rounded-full rotate-[-45deg]"
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [-2, -16, -2],
                    opacity: [0.6, 0.4, 0.6]
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                ></motion.div>
              </>
            )}
          </div>
        </div>
        {footer}
      </div>

      {data.status === 2 && (
        <div className="w-full h-full rounded-[18px] absolute top-0 left-0 z-[2] bg-[#E5E5E54D] backdrop-blur-[10px]">
          <div className="text-[24px] font-[900] text-center mt-[40px]">
            {formatNumber(data.profit_ratio, from === "seller" ? 2 : 0, true, {
              isShort: true
            })}
            x WIN
          </div>
          <div className="flex justify-center">
            <div className="p-[4px] pr-[10px] min-w-[100px] inline-flex justify-center items-center gap-[3px] rounded-[16px] bg-white border border-[#E4E4E4] backdrop-blur-[25px]">
              <Avatar
                className="text-[14px]"
                email={data?.winner_user_info?.email_desensitization}
                src={data?.winner_user_info?.icon}
                address={data?.winner_user_info?.user}
                size={24}
              />
              <div className="text-[12px] text-[#2B3337] leading-[24px]">
                {data?.winner_user_info?.name ||
                  formatAddress(data?.winner_user_info?.user)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
