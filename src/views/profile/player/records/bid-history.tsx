import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import useIsMobile from "@/hooks/use-is-mobile";
import { useNavigate } from "react-router-dom";

const BidHistory = (props: any) => {
  const {
    className,
    page,
    loading,
    data,
    hasMore,
    onPageChange
  } = props;

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const columns = [
    {
      dataIndex: "marketId",
      title: "Market ID",
      width: isMobile ? 100 : 130,
      fixed: true,
      render: (record: any) => {
        return (
          <div
           className="flex items-center gap-[7px] cursor-pointer"
           onClick={() => {
            navigate(`/btc/${record.pool_id}`);
           }}
           >
            <div className="">#{record.pool_id}</div>
            <img src="/profile/icon-share.svg" alt="share" className="w-[9px] h-[9px] shrink-0" />
          </div>
        );
      },
    },
    {
      dataIndex: "marketSize",
      title: "Market Size",
      width: 160,
      render: (record: any) => {
        return `${formatNumber(Big(record.reward_amount || 0).div(10 ** record.rewardTokenInfo?.decimals || 1), 4, true, { isShort: true, isShortUppercase: true })} ${record.rewardTokenInfo?.symbol}`;
      }
    },
    {
      dataIndex: "purchase_amount",
      title: "Bid",
      width: 170,
      render: (record: any) => {
        return `${formatNumber(record.purchase_amount, 4, true, { isShort: true, isShortUppercase: true, prefix: "-" })} ${record.purchase_token_info?.symbol}`
      }
    },
    {
      dataIndex: "prize",
      title: "Prize",
      width: isMobile ? 140 : void 0,
      render: (record: any) => {
        return (
          <div className="flex items-center gap-[4px]">
            {
              !!record.rewardTokenInfo && (
                <div className={clsx("font-[700] flex items-center gap-[4px]", ["BTC"].includes(record.rewardTokenInfo.symbol) ? "text-[#FFC42F]" : "")}>
                  <div>{formatNumber(Big(record.reward_amount || 0).div(10 ** record.rewardTokenInfo.decimals), 4, true, { isShort: true, isShortUppercase: true })}</div>
                  {
                    record.nft_ids ? (
                      <div>#{record.rewardTokenInfo.token_id}</div>
                    ) : (
                      <div>{record.rewardTokenInfo.symbol}</div>
                    )
                  }
                </div>
              )
            }
          </div>
        );
      }
    },
    {
      dataIndex: "date",
      title: "Date",
      width: isMobile ? 180 : 160,
      align: GridTableAlign.Right,
      render: (record: any) => {
        return dayjs(record.updated_at).format("hh:mm D MMM, YYYY");
      },
    },
  ];

  return (
    <div className={clsx("mt-[20px]", className)}>
      <GridTable
        data={data}
        columns={columns}
        loading={loading}
        className="max-md:w-full max-md:overflow-x-auto"
        rowClassName="max-md:px-0 max-md:gap-x-0"
        colClassName="max-md:px-[10px] max-md:bg-[#22201D]"
        bodyColClassName="max-md:first:border-r max-md:border-[#423930]"
      />
      <div className="flex justify-end items-center pt-[18px] max-md:justify-center">
        <Pagination
          current={page}
          hasNextPage={hasMore}
          size={10}
          onPrev={onPageChange}
          onNext={onPageChange}
        />
      </div>
    </div>
  );
};

export default BidHistory;
