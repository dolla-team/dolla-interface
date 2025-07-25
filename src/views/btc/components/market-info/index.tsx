import Progress from "./progress";
import { useBtcContext } from "../../context";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
// import ShareBtn from "./share-btn";

export default function MarketInfo() {
  const { poolAmount, pool } = useBtcContext();

  return (
    pool?.status !== 2 && (
      <div className="absolute left-[20px] bottom-[24%] w-[244px]">
        <div className="flex items-center justify-between">
          <div>
            <span
              className="font-[DelaGothicOne] text-[20px]"
              style={{
                WebkitTextStroke:
                  pool?.status === 3 ? "1px #C3C3C3" : "1px #FFC42F"
              }}
            >
              Market{" "}
            </span>
            <span
              className={clsx(
                "font-[DelaGothicOne] text-[20px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {" "}
              #{pool?.pool_id}
            </span>
          </div>
          {/* <ShareBtn /> */}
        </div>
        <div className="flex items-center w-[282px] h-[74px] px-[16px] mt-[10px] rounded-[8px] border border-[#3B3951] bg-[#FFFFFF1A] backdrop-blur-[10px]">
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="20"
                viewBox="0 0 17 20"
                fill="none"
              >
                <path
                  d="M8.33598 0.00373027C10.7664 0.0628534 12.7038 0.80102 14.1475 2.21857C15.5911 3.6361 16.2852 5.4885 16.2295 7.77521C16.175 10.0142 15.3918 11.8066 13.8809 13.1522C13.2686 13.6975 12.5798 14.1247 11.8165 14.4393C13.7619 15.4125 14.5475 17.1286 14.6153 18.1453C14.5956 18.1578 12.3884 19.5555 8.28715 19.5555C4.18941 19.5554 2.20831 18.16 2.18754 18.1453C2.38412 17.1627 3.07711 15.527 4.83891 14.5399C3.79126 14.1698 2.87344 13.6132 2.08696 12.8651C0.643273 11.4475 -0.051528 9.61888 0.00297316 7.37971C0.0587088 5.09315 0.841831 3.27706 2.35258 1.93146C3.91112 0.586999 5.9057 -0.055334 8.33598 0.00373027Z"
                  fill="currentColor"
                />
                <path
                  d="M5.18359 4.81055L5.18359 6.81268"
                  stroke="black"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M11.9238 5.20996L9.98937 5.72815"
                  stroke="black"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M5.38477 9.81556C6.98692 10.8166 10.3915 10.6164 11.9937 8.41406"
                  stroke="black"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span>Players</span>
            </div>
            <div
              className={clsx(
                "font-[DelaGothicOne] text-[26px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {pool?.participants || "-"}
            </div>
          </div>
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M15.6611 14.626C15.6687 15.3987 11.9942 17 7.72656 17C3.4594 16.9999 0.000447388 15.4544 0 14.6816L0.0078125 12.3633C0.879943 12.8784 3.63805 13.9091 7.72656 13.9092C11.8153 13.9092 14.7889 13.136 15.6611 12.3633V14.626ZM15.6611 9.2168C15.6687 9.98952 11.9942 11.5908 7.72656 11.5908C3.45913 11.5907 0 10.0452 0 9.27246L0.0078125 6.9541C0.879832 7.46924 3.63789 8.49992 7.72656 8.5C11.8155 8.5 14.7891 7.72682 15.6611 6.9541V9.2168ZM7.73438 0C12.002 0 15.4619 1.38376 15.4619 3.09082C15.4617 4.79782 12.0019 6.18164 7.73438 6.18164C3.46703 6.18155 0.00799003 4.79776 0.0078125 3.09082C0.0078125 1.38382 3.46692 9.56082e-05 7.73438 0Z"
                  fill="currentColor"
                />
              </svg>
              <span>Bid</span>
            </div>
            <div
              className={clsx(
                "font-[DelaGothicOne] text-[26px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              ${formatNumber(pool?.accumulative_bids, 0, true)}
            </div>
          </div>
        </div>
        <div className="mt-[8px] flex items-center">
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              Market Size
            </div>
            <div
              className={clsx(
                "font-[BlackHanSans] text-[18px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              {poolAmount} BTC
            </div>
          </div>
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              Valued
            </div>
            <div
              className={clsx(
                "font-[BlackHanSans] text-[18px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              ${formatNumber(pool?.reward_usd, 0, true)}
            </div>
          </div>
        </div>

        <div className="mt-[8px]">
          <div
            className={clsx(
              "text-[16px]",
              pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
            )}
          >
            Total Bid
          </div>
          <div className="mt-[10px]">
            <Progress data={pool} />
          </div>
        </div>
      </div>
    )
  );
}
