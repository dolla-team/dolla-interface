import Avatar from "@/components/avatar";
import MultiIcon from "./multi-icon";
import PlayerDistribution from "./player-distribution";
import { formatAddress } from "@/utils/format/address";
import dayjs from "@/libs/dayjs";
import { addThousandSeparator, formatNumber } from "@/utils/format/number";
import useWinnerBidList from "../use-winner-bid-list";
import { useMemo } from "react";
import Big from "big.js";
import { BASE_TOKEN } from "@/config/btc";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";

export default function EndPanel({ data }: { data: any }) {
  const { winnerBidList } = useWinnerBidList(data);
  const isMobile = useIsMobile();

  const [
    totalBids,
    totalTimes,
    returnMultiple,
    bidsDistribution,
    bidsProgress
  ] = useMemo(() => {
    if (!winnerBidList?.length) return [0, 0, 0, {}, []];
    let _totalBids = 0;
    let _bidsDistribution: any = {};
    let _bidsProgress: any = [];
    const startTime = new Date(data.created_at).getTime();
    const endTime = new Date(
      winnerBidList.find((item: any) => item.is_winner)?.updated_at ||
        data.updated_at
    ).getTime();

    let lastBids = 0;
    winnerBidList.forEach((item: any) => {
      _totalBids += item.times;
      _bidsDistribution[item.times] = (_bidsDistribution[item.times] || 0) + 1;
      const bidTime = new Date(item.updated_at).getTime();
      _bidsProgress.push((bidTime - startTime) / (endTime - startTime));
      if (item.is_winner) {
        lastBids = item.times;
      }
    });

    const _returnMultiple = Big(data.anchor_price)
      .div(10 ** BASE_TOKEN.decimals)
      .div(lastBids || 1)
      .toFixed(0);

    _bidsProgress.sort((a: number, b: number) => a - b);
    return [
      _totalBids,
      winnerBidList.length,
      _returnMultiple,
      _bidsDistribution,
      _bidsProgress
    ];
  }, [winnerBidList, data]);

  return (
    data && (
      <div
        className={clsx(
          "border",
          isMobile
            ? "w-screen mt-[12px] p-[20px] border-t-[#605D55] rounded-t-[20px] bg-[#000]/50 pb-[80px]"
            : "w-[815px] h-full overflow-y-auto p-[20px] border-[#605D55] rounded-[20px] bg-[#FFFFFF1A] backdrop-blur-[10px]"
        )}
      >
        <div
          className={clsx(
            "flex",
            isMobile ? "flex-col" : "h-[400px] gap-[20px]"
          )}
        >
          <div
            className={clsx(
              "rounded-[20px]",
              isMobile
                ? "w-full"
                : "w-[250px] h-full px-[20px] pt-[10px] bg-[#00000033]"
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-white text-[24px] [text-shadow:0_0_10px_rgba(255,213,105,0.5)] font-[DelaGothicOne]"
                style={{
                  WebkitTextStroke: "1px #EEAF0F"
                }}
              >
                Winner
              </span>
              <button className="text-[12px] underline button text-[#FFE9B2]">
                Verify
              </button>
            </div>
            <div
              className={clsx(
                "relative mx-auto rounded-full flex items-center justify-center",
                isMobile ? "mt-[20px] w-[150px] h-[150px]" : "mt-[47px]"
              )}
            >
              <div
                className={clsx(
                  "absolute z-[3] w-[93px] h-[93px] flex items-center justify-center",
                  isMobile
                    ? "top-[-30px] right-[-40px]"
                    : "top-[-30px] right-[-30px]"
                )}
              >
                <MultiIcon className="absolute top-0 left-0 w-full h-full" />
                <div className="text-black text-center font-[DelaGothicOne] relative z-[1] rotate-[15deg]">
                  <div className="text-[24px]">
                    {formatNumber(returnMultiple, 0, true, { isShort: true })}
                  </div>
                  <div className="mt-[-8px] text-[18px]">X</div>
                </div>
              </div>
              <Avatar
                size={150}
                address={data.winner_user_info?.sol_user}
                email={data.winner_user_info?.email}
                className="rounded-full"
              />
            </div>
            <div className="text-white text-center text-[16px] font-[DelaGothicOne] mt-[10px]">
              {data.winner_user_info?.email ||
                formatAddress(data.winner_user_info?.sol_user)}
            </div>
            <div className="flex items-center justify-between mt-[30px]">
              <span className="text-[#FFE9B2] text-[14px]">Winner’s bid</span>
              <span className="text-white text-[12px] font-[DelaGothicOne]">
                ${totalBids.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-[4px]">
              <span className="text-[#FFE9B2] text-[14px]">Bid times</span>
              <span className="text-white text-[12px] font-[DelaGothicOne]">
                {totalTimes}
              </span>
            </div>
            <div className="flex items-center justify-between mt-[4px]">
              <span className="text-[#FFE9B2] text-[14px]">
                Return multiple
              </span>
              <span className="text-white text-[12px] font-[DelaGothicOne]">
                {returnMultiple}
              </span>
            </div>
          </div>
          <div className="grow">
            {!isMobile && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <Avatar
                      size={32}
                      address={data.user_info?.sol_user}
                      email={data.user_info?.email}
                    />
                    <div>
                      <div className="text-[#FFE9B2] text-[12px]">Seller</div>
                      <div className="text-white text-[12px] font-[DelaGothicOne]">
                        {data.user_info?.email ||
                          formatAddress(data.user_info?.sol_user)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FFE9B2] text-[12px]">
                      Started from
                    </div>
                    <div className="text-white text-[14px]">
                      {dayjs(data.user_info?.created_at).format(
                        "HH:mm DD MMM, YYYY"
                      )}{" "}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[12px] mt-[16px] font-[DelaGothicOne] text-white">
                  <div className="w-1/3 h-[70px] flex flex-col items-center justify-center bg-[#00000033] rounded-[10px]">
                    <div className="text-[12px]">Total Players</div>
                    <div className="text-[16px]">{data?.participants}</div>
                  </div>
                  <div className="w-1/3 h-[70px] flex flex-col items-center justify-center bg-[#00000033] rounded-[10px]">
                    <div className="text-[12px]">Total Bid</div>
                    <div className="text-[16px]">
                      ${addThousandSeparator(data?.accumulative_bids)}
                    </div>
                  </div>
                  <div className="w-1/3 h-[70px] flex flex-col items-center justify-center bg-[#00000033] rounded-[10px]">
                    <div className="text-[12px]">Time Duration</div>
                    <div className="text-[16px]">
                      {data?.created_at && data?.updated_at
                        ? dayjs(data.created_at).from(
                            dayjs(data.updated_at),
                            true
                          )
                        : "-"}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-[8px]">
              <div
                className={clsx(
                  isMobile
                    ? "text-[14px] text-[#FFE9B2]"
                    : "text-white text-[12px] font-[DelaGothicOne]"
                )}
              >
                Winner’s Bid Timing
              </div>
              <div className="w-full relative h-[6px] mt-[40px] bg-linear-to-r from-[#FFC42F] via-[#FF43E0] to-[#53EABF] rounded-[6px]">
                {bidsProgress.map((item: any, index: number) => (
                  <ProgressAvatar
                    data={data}
                    progress={item}
                    key={index}
                    index={index}
                  />
                ))}
              </div>
            </div>
            <div className="mt-[24px] h-[calc(100%-250px)]">
              <div
                className={clsx(
                  isMobile
                    ? "text-[14px] text-[#FFE9B2]"
                    : "text-white text-[12px] font-[DelaGothicOne]"
                )}
              >
                Player Distribution
              </div>
              <PlayerDistribution
                data={data}
                bidsDistribution={bidsDistribution}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
}

const ProgressAvatar = ({
  data,
  progress,
  index
}: {
  data: any;
  progress: number;
  index: number;
}) => {
  return (
    <div
      className="w-[28px] h-[28px] border border-[#DD9000] rounded-[6px] absolute top-[-33px]"
      style={{
        left: `calc(${progress * 100}% - 14px)`,
        zIndex: index
      }}
    >
      <Avatar
        size={26}
        address={data.winner_user_info?.sol_user}
        email={data.winner_user_info?.email}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="6"
        viewBox="0 0 8 6"
        fill="none"
        className="absolute bottom-[-6px] left-[50%] translate-x-[-50%]"
      >
        <path
          d="M3.18912 4.8764C3.58825 5.42946 4.41175 5.42946 4.81088 4.87641L7.1861 1.58521C7.6634 0.923842 7.19083 0 6.37522 0H1.62478C0.809174 0 0.336598 0.923841 0.813896 1.58521L3.18912 4.8764Z"
          fill="#DD9000"
        />
      </svg>
    </div>
  );
};
