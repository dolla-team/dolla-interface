import clsx from "clsx";
import GridTable, { GridTableAlign } from "@/components/grid-table";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import useRecords from "@/hooks/transaction/use-records";
import { formatNumber } from "@/utils/format/number";

import useIsMobile from "@/hooks/use-is-mobile";

const Account = (props: any) => {
  const { className } = props;

  const { records, currentPage, hasMore, loading, loadPage } = useRecords();
  const isMobile = useIsMobile();

  const columns = [
    {
      dataIndex: "typeName",
      title: "Type",
      width: 150,
      fixed: true,
      render: (record: any) => {
        return record.business_type;
      }
    },
    {
      dataIndex: "assets",
      title: "Assets",
      width: isMobile ? 170 : void 0,
      render: (record: any) => {
        return (
          <div className={clsx("flex items-center gap-[4px]")}>
            <img
              src={record.token.icon}
              className="w-[32px] h-[32px] rounded-full object-cover"
            />
            <div className="">{record.token?.symbol}</div>
          </div>
        );
      }
    },
    {
      dataIndex: "valued",
      title: "Amount",
      width: 110,
      render: (record: any) => {
        return formatNumber(record.amount, 3, true, {
          isShort: true,
          isShortUppercase: true
        });
      }
    },
    // {
    //   dataIndex: "wallet",
    //   title: "Wallet",
    //   width: 200,
    //   render: (record: any) => {
    //     const currentChain = Object.values(chains).find(
    //       (it: any) => it.name.toLowerCase() === record.chain?.toLowerCase()
    //     );
    //     let txUrl: any;
    //     if (currentChain) {
    //       txUrl = `${currentChain?.blockExplorers?.default?.url}/tx/${
    //         record.tx_hash
    //       }?cluster=${import.meta.env.VITE_SOLANA_CLUSTER_NAME}`;
    //     }
    //     return (
    //       <div className="flex items-center gap-[7px]">
    //         <div className="text-[#BBACA6]">
    //           {record.type === "deposit" ? "From" : "To"}
    //         </div>
    //         {txUrl ? (
    //           <a target="_blank" href={txUrl} className="block">
    //             {record.type === "deposit"
    //               ? formatAddress(record.from)
    //               : formatAddress(record.to)}
    //           </a>
    //         ) : (
    //           <div className="block">
    //             {record.type === "deposit"
    //               ? formatAddress(record.from)
    //               : formatAddress(record.to)}
    //           </div>
    //         )}
    //         <img
    //           src="/profile/icon-share.svg"
    //           alt="share"
    //           className="w-[9px] h-[9px] shrink-0"
    //         />
    //       </div>
    //     );
    //   }
    // },
    {
      dataIndex: "date",
      title: "Date",
      width: isMobile ? 180 : 160,
      align: GridTableAlign.Right,
      render: (record: any) => {
        return dayjs(record.updated_at).format("hh:mm D MMM, YYYY");
      }
    }
  ];

  return (
    <div className={clsx("mt-[20px]", className)}>
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
          hasNextPage={hasMore}
          size={20}
          onPrev={() => loadPage(-1)}
          onNext={() => loadPage(1)}
        />
      </div>
    </div>
  );
};

export default Account;
