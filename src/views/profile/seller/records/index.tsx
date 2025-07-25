import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import chains from "@/config/chains";
import { ESellerRecordsType } from "../hooks/use-create-pool-list";

const Records = (props: any) => {
  const { className, records, loading, onPrevPage, onNextPage, hasNextPage, currentPage, recordsPrices } = props;

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
        return ESellerRecordsType[record.type] || "";
      }
    },
    {
      dataIndex: "assets",
      title: "Assets",
      width: 170,
      render: (record: any) => {
        return (
          <div className={clsx("flex items-center gap-[4px]", [ESellerRecordsType.Claimed, ESellerRecordsType.Refund].includes(record.type) ? "text-[#54FF59]" : "")}>
            <div>
              {formatNumber(record.amountBig, 3, true, { isShort: true, isShortUppercase: true })}
            </div>
            <div>
              {record.token_info?.symbol}
            </div>
          </div>
        );
      }
    },
    {
      dataIndex: "valued",
      title: "Valued",
      render: (record: any) => {
        return formatNumber(Big(record.amountBig || 0).times(recordsPrices[record.priceKey] || 0), 3, true, { isShort: true, isShortUppercase: true, prefix: "$" });
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
