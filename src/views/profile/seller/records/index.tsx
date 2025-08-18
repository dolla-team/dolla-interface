import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { ESellerRecordsType } from "../hooks/use-create-pool-list";
import useIsMobile from "@/hooks/use-is-mobile";
import { useNavigate } from "react-router-dom";
import chains from "@/config/chains";

const Records = (props: any) => {
  const {
    className,
    records,
    loading,
    onPrevPage,
    onNextPage,
    hasNextPage,
    currentPage,
    recordsPrices
  } = props;

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const columns = [
    {
      dataIndex: "marketId",
      title: "Market ID",
      width: 130,
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
            <img
              src="/profile/icon-share.svg"
              alt="share"
              className="w-[9px] h-[9px] shrink-0"
            />
          </div>
        );
      }
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
          <div
            className={clsx(
              "flex items-center gap-[4px]",
              [ESellerRecordsType.Claimed, ESellerRecordsType.Refund].includes(
                record.type
              )
                ? "text-[#54FF59]"
                : ""
            )}
          >
            <div>
              {formatNumber(record.amountBig, 3, true, {
                isShort: true,
                isShortUppercase: true
              })}
            </div>
            <div>{record.token_info?.symbol}</div>
          </div>
        );
      }
    },
    {
      dataIndex: "valued",
      title: "Valued",
      width: isMobile ? 170 : void 0,
      render: (record: any) => {
        return formatNumber(
          Big(record.amountBig || 0).times(recordsPrices[record.priceKey] || 0),
          3,
          true,
          { isShort: true, isShortUppercase: true, prefix: "$" }
        );
      }
    },
    {
      dataIndex: "date",
      title: "Date",
      width: isMobile ? 200 : 170,
      align: GridTableAlign.Right,
      render: (record: any) => {
        const currentChain = Object.values(chains).find(
          (it: any) => it.name.toLowerCase() === record.chain?.toLowerCase()
        );
        let txUrl: any;
        if (currentChain) {
          txUrl = `${currentChain?.blockExplorers?.default?.url}/tx/${
            record.tx_hash
          }?cluster=${import.meta.env.VITE_SOLANA_CLUSTER_NAME}`;
        }
        return (
          <div
            className="flex justify-end items-center gap-[11px] cursor-pointer"
            onClick={() => {
              if (!txUrl) return;
              window.open(txUrl, "_blank");
            }}
          >
            <div className="text-[#8795A7]">
              {dayjs(record.updated_at).format("hh:mm D MMM, YYYY")}
            </div>
            <img
              src="/profile/icon-share.svg"
              alt="share"
              className="w-[9px] h-[9px] shrink-0"
            />
          </div>
        );
      }
    }
  ];

  return (
    <div
      className={clsx(
        "mt-[20px] max-md:w-screen max-md:mt-0 max-md:p-[17px_0]",
        className
      )}
    >
      <GridTable
        data={records}
        columns={columns}
        loading={loading}
        className="max-md:w-full max-md:overflow-x-auto"
        rowClassName="max-md:px-0 max-md:gap-x-0"
        colClassName="max-md:px-[10px] max-md:bg-[#22201D]"
        bodyColClassName="max-md:first:border-r max-md:border-[#423930]"
      />
      <div className="flex justify-end items-center pt-[18px] max-md:justify-center">
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
