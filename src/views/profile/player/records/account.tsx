import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import useUserRecords, { EUserRecordsType } from "@/hooks/use-user-records";
import { formatNumber } from "@/utils/format/number";
import { formatAddress } from "@/utils/format/address";
import chains from "@/config/chains";
import Big from "big.js";
import useIsMobile from "@/hooks/use-is-mobile";

const Account = (props: any) => {
  const { className } = props;

  const {
    userRecords,
    userRecordsPrices,
    userRecordsLoading,
    userRecordsPageIndex,
    hasNextPage,
    onUserRecordsPageChange,
  } = useUserRecords({ isSinglePage: true, pageLimit: 10 });
  const isMobile = useIsMobile();

  const columns = [
    {
      dataIndex: "typeName",
      title: "Type",
      width: 150,
      fixed: true,
      render: (record: any) => {
        if (record.type === EUserRecordsType.Refund) {
          return (
            <div className="flex items-center gap-[4px]">
              <div className="">{record.typeName}</div>
              {
                Big(record.pool_id || 0).gt(0) && (
                  <div className="">#{record.pool_id}</div>
                )
              }
            </div>
          );
        }
        if (record.type === EUserRecordsType.LuckyDraw) {
          return (
            <div className="flex items-center gap-[4px]">
              <div className="">{record.typeName}</div>
              {
                Big(record.prize_draw_id || 0).gt(0) && (
                  <div className="">#{record.prize_draw_id}</div>
                )
              }
            </div>
          );
        }
        return record.typeName;
      }
    },
    {
      dataIndex: "assets",
      title: "Assets",
      width: isMobile ? 170 : void 0,
      render: (record: any) => {
        return (
          <div className={clsx("flex items-center gap-[10px]")}>
            {
              record.type === EUserRecordsType.Transfer && (
                <>
                  <div className="">
                    {formatNumber(record.pts, 0, true, { isShort: true, isShortUppercase: true })}
                  </div>
                  <svg className="shrink-" width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3536 4.85355C12.5488 4.65829 12.5488 4.34171 12.3536 4.14645L9.17157 0.964466C8.97631 0.769204 8.65973 0.769204 8.46447 0.964466C8.2692 1.15973 8.2692 1.47631 8.46447 1.67157L11.2929 4.5L8.46447 7.32843C8.2692 7.52369 8.2692 7.84027 8.46447 8.03553C8.65973 8.2308 8.97631 8.2308 9.17157 8.03553L12.3536 4.85355ZM0 4.5V5H12V4.5V4H0V4.5Z" fill="#BBACA6" />
                  </svg>
                </>
              )
            }
            <div className={clsx("flex items-center gap-[4px]", ![EUserRecordsType.Deposit].includes(record.type) ? "text-[#54FF59]" : "")}>
              <div className="">
                {formatNumber(record.amountBig, 3, true, { isShort: true, isShortUppercase: true })}
              </div>
              <div className="">{record.token_info?.symbol}</div>
            </div>
          </div>
        );
      }
    },
    {
      dataIndex: "valued",
      title: "Valued",
      width: 110,
      render: (record: any) => {
        return formatNumber(Big(record.amountBig).times(userRecordsPrices[record.priceKey] || 0), 3, true, { isShort: true, isShortUppercase: true, prefix: "$" });
      }
    },
    {
      dataIndex: "wallet",
      title: "Wallet",
      width: 200,
      render: (record: any) => {
        const currentChain = Object.values(chains).find((it: any) => it.name.toLowerCase() === record.chain?.toLowerCase());
        let txUrl: any;
        if (currentChain) {
          txUrl = `${currentChain?.blockExplorers?.default?.url}/tx/${record.tx_hash}?cluster=${import.meta.env.VITE_SOLANA_CLUSTER_NAME}`;
        }
        return (
          <div className="flex items-center gap-[7px]">
            <div className="text-[#BBACA6]">
              {record.type === EUserRecordsType.Deposit ? "From" : "To"}
            </div>
            {
              txUrl ? (
                <a target="_blank" href={txUrl} className="block">
                  {record.type === EUserRecordsType.Deposit ? formatAddress(record.from) : formatAddress(record.to)}
                </a>
              ) : (
                <div className="block">
                  {record.type === EUserRecordsType.Deposit ? formatAddress(record.from) : formatAddress(record.to)}
                </div>
              )
            }
            <img src="/profile/icon-share.svg" alt="share" className="w-[9px] h-[9px] shrink-0" />
          </div>
        );
      },
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
        data={userRecords}
        columns={columns}
        loading={userRecordsLoading}
        className="max-md:w-full max-md:overflow-x-auto"
        rowClassName="max-md:px-0 max-md:gap-x-0"
        colClassName="max-md:px-[10px] max-md:bg-[#22201D]"
        bodyColClassName="max-md:first:border-r max-md:border-[#423930]"
      />
      <div className="flex justify-end items-center pt-[18px] max-md:justify-center">
        <Pagination
          current={userRecordsPageIndex}
          hasNextPage={hasNextPage}
          size={20}
          onPrev={onUserRecordsPageChange}
          onNext={onUserRecordsPageChange}
        />
      </div>
    </div>
  );
};

export default Account;
