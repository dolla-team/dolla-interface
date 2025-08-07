import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import useIsMobile from "@/hooks/use-is-mobile";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/use-toast";
import chains from "@/config/chains";

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
  const toast = useToast();

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
      title: "Date /  TX",
      width: isMobile ? 230 : 210,
      align: GridTableAlign.Right,
      render: (record: any) => {
        const currentChain = Object.values(chains).find((it: any) => it.name.toLowerCase() === record.chain?.toLowerCase());
        let txUrl: any;
        if (currentChain) {
          txUrl = `${currentChain?.blockExplorers?.default?.url}/tx/${record.tx_hash}?cluster=${import.meta.env.VITE_SOLANA_CLUSTER_NAME}`;
        }
        return (
          <div className="flex items-center justify-end gap-[10px]">
            <div className="">
              {dayjs(record.updated_at).format("hh:mm D MMM, YYYY")}
            </div>
            <a
              href={txUrl ? txUrl : "javascript:void(0);"}
              target="_blank"
              rel="noreferrer noopener nofollow"
              className="text-[#FFC42F] underline underline-offset-2 font-[SpaceGrotesk] text-[16px] font-[400]"
            >
              TX
            </a>
            <button
              type="button"
              className="button w-[14px] h-[14px] shrink-0 flex justify-center items-center bg-[url('/profile/icon-copy.svg')] bg-no-repeat bg-center bg-contain"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(record.tx_hash || "");
                  toast.success({ title: "Copied to clipboard" });
                } catch (error) {
                  toast.fail({ title: "Failed to copy" });
                }
              }}
            />
          </div>
        );
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
