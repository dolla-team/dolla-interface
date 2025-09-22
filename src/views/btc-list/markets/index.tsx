import columns from "./columns";
import SortIcon from "./sort-icon";
import Market from "./market";
import usePoolList from "@/hooks/use-pool-list";
import Loading from "@/components/icons/loading";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Markets() {
  const navigate = useNavigate();
  const {
    poolList,
    loading,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    volume,
    setVolume
  } = usePoolList({
    pageLimit: 100,
    tokenStatus: 0
  });

  return (
    <div className="w-full bg-white mt-[30px] rounded-[16px] border border-[#F2F2F233] px-[30px] py-[20px]">
      <div className="flex items-center justify-between">
        <div className="text-[20px] text-black font-[700] mb-[10px]">
          All Markets
        </div>
        <div className="flex items-center h-[40px] p-[2px] bg-[#0000000D] border border-[#F2F2F233] rounded-[10px]">
          {[
            { label: "All", key: 0 },
            { label: "1 BTC", key: 1 },
            { label: "0.1 BTC", key: 0.1 },
            { label: "0.01 BTC", key: 0.01 }
          ].map((item) => (
            <button
              key={item.key}
              className={clsx(
                "button min-w-[50px] text-center h-[34px] rounded-[8px] text-[12px] px-[10px]",
                volume === item.key
                  ? "bg-[#FFC42F] text-black"
                  : "text-[#8A87AA]"
              )}
              onClick={() => setVolume(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center text-[#8A87AA] text-[12px] mt-[20px] pl-[14px] pr-[20px]">
        {columns.map((column: any) => (
          <div
            key={column.title}
            className="flex items-center gap-[4px]"
            style={{ width: column.width }}
          >
            <span>{column.title}</span>
            {column.sort && (
              <SortIcon
                active={sortField === column.dataIndex}
                expanded={sortField === column.dataIndex && sortOrder === "asc"}
                onClick={() => {
                  setSortField(column.dataIndex);
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-[20px] flex flex-col gap-[10px]">
        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <Loading size={20} />
          </div>
        ) : poolList.length === 0 ? (
          <div className="text-center text-[#8A87AA] text-[14px] leading-[140px]">
            No data
          </div>
        ) : (
          poolList.map((item: any) => (
            <Market
              key={item.id}
              data={item}
              onClick={() => {
                navigate(`/btc/detail/${item.pool_id}`);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
