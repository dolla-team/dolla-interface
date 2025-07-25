import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import chains from "@/config/chains";
import { MarketStatusMap, EMarketStatus } from "../../ components/market-status";

const Records = (props: any) => {
  const { className, records, loading, onPrevPage, onNextPage, hasNextPage, currentPage } = props;

  const columns = [
    {
      dataIndex: "marketId",
      title: "Market ID",
      width: 130,
      render: (record: any) => {
        const currentChain = Object.values(chains).find((chain) => chain.name.toLowerCase() === record.chain.toLowerCase());
        return (
          <div
           className="flex items-center gap-[7px] cursor-pointer"
           onClick={() => {
            if (!currentChain) return;
             window.open(`${currentChain.blockExplorers?.default?.url}/tx/${record.tx_hash}`, "_blank");
           }}
           >
            <div className="">#{record.id}</div>
            <img src="/profile/icon-share.svg" alt="share" className="w-[9px] h-[9px] shrink-0" />
          </div>
        );
      },
    },
    {
      dataIndex: "type",
      title: "Type",
      width: 160,
      render: (record: any) => {
        const { status, is_claim } = record;

        if (is_claim) {
          return "Claimed";
        }

        return MarketStatusMap[status as EMarketStatus]?.name || "";
      }
    },
    {
      dataIndex: "assets",
      title: "Assets",
      width: 170,
      render: (record: any) => {
        return (
          <>
            {record?.nft_ids
              ? 1
              : record?.reward_token_info?.[0]?.decimals && record?.reward_amount
                ? formatNumber(
                  Big(record.reward_amount || 0).div(
                    10 ** record?.reward_token_info?.[0].decimals
                  ),
                  3,
                  true
                )
                : "-"}{" "}
            {record?.reward_token_info?.[0].symbol}
          </>
        );
      }
    },
    {
      dataIndex: "valued",
      title: "Valued",
      render: (record: any) => {
        return formatNumber(record.reward_usd, 2, true, { prefix: "$" });
      }
    },
    {
      dataIndex: "date",
      title: "Date",
      width: 170,
      align: GridTableAlign.Right,
      render: (record: any) => {
        return (
          <div className="flex justify-end items-center gap-[11px]">
            <div className="text-[#BBACA6]">
              {dayjs(record.updated_at).format("hh:mm D MMM, YYYY")}
            </div>
            <img src="/profile/icon-share.svg" alt="share" className="w-[9px] h-[9px] shrink-0" />
          </div>
        );
      },
    },
  ];

  return (
    <div className={clsx("mt-[20px]", className)}>
      <GridTable
        data={records}
        columns={columns}
        loading={loading}
      />
      <div className="flex justify-end items-center pt-[18px]">
        <Pagination
          current={currentPage}
          size={10}
          hasNextPage={hasNextPage}
          onPrev={onPrevPage}
          onNext={onNextPage}
        />
      </div>
    </div>
  );
};

export default Records;
