import Avatar from "@/components/avatar";
import PlayerDistribution from "./player-distribution";
import { formatAddress } from "@/utils/format/address";
import dayjs from "@/libs/dayjs";
import { addThousandSeparator, formatNumber } from "@/utils/format/number";
import { useMemo, useState } from "react";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import MultipleTag from "@/components/multiple-tag";
import ProvablyFair from "@/sections/provably-fair";
import { useBtcContext } from "../../context";
import useBtcDetailStore from "@/stores/use-btc-detail";
import { useAuth } from "@/contexts/auth";

export default function EndPanel({ data }: { data: any }) {
  const { winnerBidList, onReplay } = useBtcContext();
  const isMobile = useIsMobile();
  const [openProvablyFair, setOpenProvablyFair] = useState(false);
  const btcDetailStore = useBtcDetailStore();
  const { userInfo } = useAuth();

  const [totalBids, totalTimes, bidsDistribution, bidsProgress, winnerBids] =
    useMemo(() => {
      if (!winnerBidList?.length) return [0, 0, {}, [], 0];
      let _totalBids = 0;
      let _bidsDistribution: any = {};
      let _bidsProgress: any = [];
      const winnerBid = winnerBidList.find((item: any) => item.is_winner);
      const startTime = new Date(data.created_at).getTime();
      const endTime = new Date(
        winnerBid?.result_time || data.result_time
      ).getTime();

      winnerBidList.forEach((item: any) => {
        _totalBids += item.times;
        _bidsDistribution[item.times] =
          (_bidsDistribution[item.times] || 0) + 1;
        const bidTime = new Date(item.time).getTime();
        _bidsProgress.push((bidTime - startTime) / (endTime - startTime));
      });

      _bidsProgress.sort((a: number, b: number) => a - b);
      return [
        _totalBids,
        winnerBidList.length,
        _bidsDistribution,
        _bidsProgress,
        winnerBid?.times
      ];
    }, [winnerBidList, data]);

  return (
    data && (
      <>
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
                <span className="text-white text-[20px] font-[700]">
                  Winner
                </span>
                <button
                  onClick={() => {
                    setOpenProvablyFair(true);
                  }}
                  className="text-[12px] underline button text-white"
                >
                  Verify
                </button>
              </div>
              <div
                className={clsx(
                  "relative mx-auto rounded-full flex items-center justify-center w-[150px] h-[150px]",
                  isMobile ? "mt-[20px] w-[150px] h-[150px]" : "mt-[47px]"
                )}
              >
                <MultipleTag
                  multipler={formatNumber(data.winner_profit_ratio, 1, true)}
                  size={120}
                  className="absolute top-[-50px] right-[-50px]"
                  textClassName="text-[24px]"
                />
                <Avatar
                  size={150}
                  src={data.winner_user_info?.icon}
                  address={data.winner_user_info?.user}
                  className="rounded-full text-[48px] font-[500]"
                />
              </div>
              <div className="text-white text-center text-[16px] max-w-full truncate mt-[10px]">
                {data.winner_user_info?.name ||
                  formatAddress(data.winner_user_info?.user)}
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
                  {formatNumber(data.winner_profit_ratio, 1, true, {
                    isShort: true
                  })}
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
                        src={data.user_info?.icon}
                        address={data.user_info?.user}
                        className="text-[16px]"
                      />
                      <div>
                        <div className="text-[#FFE9B2] text-[12px]">Seller</div>
                        <div className="text-white text-[12px] font-[DelaGothicOne]">
                          {data.user_info?.name ||
                            formatAddress(data.user_info?.user)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#FFE9B2] text-[12px]">
                        Started from
                      </div>
                      <div className="text-white text-[14px]">
                        {dayjs(data?.created_at).format("HH:mm DD MMM, YYYY")}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-[12px] mt-[16px] font-[DelaGothicOne] text-white">
                    <div className="w-1/3 h-[70px] flex flex-col items-center justify-center bg-[#00000033] rounded-[10px]">
                      <div className="text-[12px]">Total Bidders</div>
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
                        {data?.created_at && data?.result_time
                          ? dayjs(data.created_at).from(
                              dayjs(data.result_time),
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
                  {bidsProgress?.map((item: any, index: number) => (
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
                  Bidder Distribution
                </div>
                <PlayerDistribution
                  data={data}
                  bidsDistribution={bidsDistribution}
                />
              </div>
            </div>
          </div>

          <ProvablyFair
            data={{
              hash: data.result_tx_hash,
              pool_id: data.pool_id,
              market_size: data.reward_usd,
              bids: totalBids
            }}
            open={openProvablyFair}
            onClose={() => {
              setOpenProvablyFair(false);
            }}
          />
        </div>
        {/* data?.winner_user_id === userInfo?.id */}
        {true && (
          <div className="absolute bottom-[-40px] left-0 z-[10] w-full flex items-center justify-center">
            <button
              className="button flex items-center gap-[10px]"
              onClick={() => {
                btcDetailStore.set({
                  bidResult: {
                    is_winner: true
                  },
                  bids: winnerBids,
                  flipStatus: 5
                });
                onReplay();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="15"
                viewBox="0 0 13 15"
                fill="none"
              >
                <path
                  d="M12 5.46709C13.3333 6.23689 13.3333 8.16139 12 8.93119L3 14.1273C1.66667 14.8971 -7.31543e-07 13.9349 -6.64245e-07 12.3953L-2.09983e-07 2.00299C-1.42685e-07 0.46339 1.66667 -0.498862 3 0.270938L12 5.46709Z"
                  fill="white"
                />
              </svg>
              <span className="text-white text-[14px]">
                Replay Winning Process{" "}
              </span>
            </button>
          </div>
        )}
      </>
    )
  );
}

export const ProgressAvatar = ({
  data,
  progress,
  index,
  className
}: {
  data: any;
  progress: number;
  index: number;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        "w-[28px] h-[28px] border border-[#DD9000] rounded-[6px] absolute top-[-33px]",
        className
      )}
      style={{
        left: `calc(${progress * 100}% - 14px)`,
        zIndex: index
      }}
    >
      <Avatar
        size={26}
        src={data.winner_user_info?.icon}
        address={data.winner_user_info?.user}
        className={clsx("text-[12px] !rounded-[4px]", className)}
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
