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
      width: "15%",
      fixed: true,
      render: (record: any) => {
        return record.business_type;
      }
    },
    {
      dataIndex: "assets",
      title: "Assets",
      width: "25%",
      render: (record: any) => {
        return (
          <div className={clsx("flex items-center gap-[4px]")}>
            {record.tokens[0]?.icon && (
              <img
                src={record.tokens[0].icon}
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
            )}
            {record.tokens[1]?.icon && (
              <img
                src={record.tokens[1].icon}
                className="w-[32px] h-[32px] rounded-full object-cover ml-[-10px]"
              />
            )}
          </div>
        );
      }
    },
    {
      dataIndex: "valued",
      title: "Amount",
      width: "20%",
      render: (record: any) => {
        return (
          <div className="flex items-center gap-[4px]">
            <span>
              {formatNumber(record.amount, 3, true, {
                isShort: true,
                isShortUppercase: true
              })}
            </span>
            <div className="">{record.tokens[0]?.symbol}</div>
          </div>
        );
      }
    },
    {
      dataIndex: "status",
      title: "Status",
      width: "15%",
      render: (record: any) => {
        return (
          <div
            className={clsx(
              record.status === "Success"
                ? "text-[#4DCF5E]"
                : record.status === "Processing"
                ? "text-[#FFC42F]"
                : "text-[#FF6A8E]"
            )}
          >
            {record.status}
          </div>
        );
      }
    },
    {
      dataIndex: "date",
      title: "Date",
      width: "20%",
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
