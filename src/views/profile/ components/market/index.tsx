import clsx from "clsx";
import { motion } from "framer-motion";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import { getAnchorPrice } from "@/utils/pool";
import MarketActiveBg from "./market-active-bg";
import useIsMobile from "@/hooks/use-is-mobile";
import { formatAddress } from "@/utils/format/address";
import Avatar from "@/components/avatar";

export default function Market({
  data,
  className,
  footer,
  header,
  isAcitveBg = true,
  onClick = () => {},
  isForceNormal,
  isActive
}: {
  data: any;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isAcitveBg?: boolean;
  onClick?: () => void;
  isForceNormal?: boolean;
  isActive?: boolean;
}) {
  const progress = useMemo(() => {
    if (!data?.accumulative_bids || data?.anchor_price === "0") return 0;

    return (data.accumulative_bids / getAnchorPrice(data)) * 100;
  }, [data]);

  const isMobile = useIsMobile();
  if (data.status === 2) {
    console.log("data", data);
  }
  return (
    <div
      className={clsx(
        "cursor-pointer group shrink-0 rounded-[16px] border-[1px] border-[#383F47] bg-[radial-gradient(81.26%_82.97%_at_1.18%_2.95%,_rgba(111,_55,_255,_0.20)_0%,_rgba(0,_0,_0,_0.20)_100%)] bg-[#1A1E24] transition-all duration-300 relative",
        isActive
          ? "shadow-[0px_0px_20px_0px_rgba(255,_239,_67,_0.60)] bg-[url('/btc/bg-market-active-border.svg')] bg-[length:344px_222px] bg-no-repeat bg-center"
          : "",
        isMobile
          ? ""
          : "hover:border-[#743EFF] hover:scale-[1.05] hover:shadow-[0px_0px_20px_0px_rgba(116,_62,_255,_0.60)]",
        className
      )}
      onClick={onClick}
    >
      {header}
      {isAcitveBg &&
        (isActive ? (
          <img
            src="/btc/bg-market-active.png"
            alt=""
            className="w-[340px] h-[218px] absolute left-0 top-0 object-center object-contain"
          />
        ) : (
          <MarketActiveBg />
        ))}
      <div className="relative z-[2]">
        <div
          className={clsx(
            "",
            isForceNormal
              ? ""
              : "max-md:flex max-md:justify-between max-md:p-[23px_16px_0_12px]"
          )}
        >
          <div
            className={clsx(
              "pt-[14px] px-[12px]",
              isForceNormal ? "" : "max-md:px-0 max-md:pt-0"
            )}
          >
            {!isForceNormal && isMobile && (
              <div className="text-[14px] font-[400] text-white">
                Market #{data?.pool_id}
              </div>
            )}
            <div
              className={clsx(
                "flex items-center justify-between",
                isForceNormal ? "" : "max-md:mt-[9px]"
              )}
            >
              <div className="flex items-center gap-[6px]"></div>
              {data?.nft_ids && (
                <span className="text-[12px] text-[#8795A7]">
                  #{data?.nft_ids}
                </span>
              )}
            </div>
          </div>
          <div
            className={clsx("flex items-center gap-[10px] px-[12px] pt-[10px]")}
          >
            <img
              className="w-[72px] h-[72px] rounded-[10px] border-[2px] border-[#999677]"
              src={data?.reward_token_info?.[0]?.icon}
            />
            <div className="grow">
              <div className="text-[12px] text-white">
                {data?.reward_token_info?.[0]?.name}{" "}
                {data?.reward_token_info?.[0]?.token_id}
              </div>
              <div className="flex items-center gap-[8px] mt-[6px]">
                <Avatar
                  size={20}
                  address={data?.user_info?.user}
                  email={data?.user_info?.email}
                />
                <div className="text-[12px] text-white">
                  {data?.user_info?.email ||
                    formatAddress(data?.user_info?.user)}
                </div>
              </div>
              <div className="flex justify-between items-center text-[12px] text-[#8795A7] mt-[6px]">
                <span>Valued</span>
                <span className="text-right">
                  {formatNumber(data?.value || 0, 0, true, {
                    prefix: "$"
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "px-[12px] flex items-center justify-between text-[12px] text-white",
            isActive
              ? "mt-[23px] font-[DelaGothicOne] text-[#FFE9B2]"
              : "mt-[16px]"
          )}
        >
          <div className="flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
            >
              <path
                d="M8.33598 0.00373027C10.7664 0.0628534 12.7038 0.80102 14.1475 2.21857C15.5911 3.6361 16.2852 5.4885 16.2295 7.77521C16.175 10.0142 15.3918 11.8066 13.8809 13.1522C13.2686 13.6975 12.5798 14.1247 11.8165 14.4393C13.7619 15.4125 14.5475 17.1286 14.6153 18.1453C14.5956 18.1578 12.3884 19.5555 8.28715 19.5555C4.18941 19.5554 2.20831 18.16 2.18754 18.1453C2.38412 17.1627 3.07711 15.527 4.83891 14.5399C3.79126 14.1698 2.87344 13.6132 2.08696 12.8651C0.643273 11.4475 -0.051528 9.61888 0.00297316 7.37971C0.0587088 5.09315 0.841831 3.27706 2.35258 1.93146C3.91112 0.586999 5.9057 -0.055334 8.33598 0.00373027Z"
                fill={isActive ? "#FFE9B2" : "#ADBCCF"}
              />
              <path
                d="M5.18359 4.81055L5.18359 6.81268"
                stroke="black"
                stroke-width="1.6"
                stroke-linecap="round"
              />
              <path
                d="M11.924 5.20996L9.9895 5.72815"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M5.38489 9.81556C6.98704 10.8166 10.3916 10.6164 11.9938 8.41406"
                stroke="black"
                strokeWidth="1.6"
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
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M15.6611 14.6255C15.6687 15.3982 11.9942 16.9995 7.72656 16.9995C3.4594 16.9994 0.000447388 15.4539 0 14.6812L0.0078125 12.3628C0.879943 12.878 3.63805 13.9086 7.72656 13.9087C11.8153 13.9087 14.7889 13.1355 15.6611 12.3628V14.6255ZM15.6611 9.21631C15.6687 9.98904 11.9942 11.5903 7.72656 11.5903C3.45913 11.5902 0 10.0447 0 9.27197L0.0078125 6.95361C0.879832 7.46875 3.63789 8.49943 7.72656 8.49951C11.8155 8.49951 14.7891 7.72633 15.6611 6.95361V9.21631ZM7.73438 -0.000488281C12.002 -0.000488281 15.4619 1.38327 15.4619 3.09033C15.4617 4.79733 12.0019 6.18115 7.73438 6.18115C3.46703 6.18106 0.00799003 4.79727 0.0078125 3.09033C0.0078125 1.38333 3.46692 -0.000392673 7.73438 -0.000488281Z"
                fill={isActive ? "#FFE9B2" : "#ADBCCF"}
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
            "mt-[15px] rounded-[6px] relative mx-[11px]",
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
        <div className="w-full h-full rounded-[16px] absolute top-0 left-0 z-[2] bg-[#00000080]">
          <div className="flex justify-center mt-[100px]">
            <div className="p-[2px] pr-[10px] min-w-[100px] inline-flex gap-[3px] rounded-[12px] bg-[#FFFFFF1A] backdrop-blur-[25px]">
              <Avatar
                address={data.winner_user}
                email={data.pool_info?.winner_user_info?.email}
                size={24}
              />
              <div className="text-[12px] font-semibold text-white leading-[24px]">
                {data.pool_info?.winner_user_info?.email ||
                  formatAddress(data?.pool_info?.winner_user)}
              </div>
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
            {formatNumber(data.reward_usd, 0, true, { isShort: true })}x WIN
          </div>
        </div>
      )}
    </div>
  );
}
