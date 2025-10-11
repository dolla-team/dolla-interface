import Loading from "@/components/icons/loading";
import clsx from "clsx";
import useHistory from "../use-history";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import LoadingMore from "@/components/loading/loading-more";
import { useEffect } from "react";
import dayjs from "dayjs";
import useIsMobile from "@/hooks/use-is-mobile";
import Empty from "@/sections/wallet/panels/info/empty";

export default function History({
  showHistory,
  itemsMap
}: {
  showHistory: boolean;
  itemsMap: any;
}) {
  const isMobile = useIsMobile();
  const { data, loading, hasMore, getHistory } = useHistory();
  const { containerRef, isLoading } = useInfiniteScroll(getHistory, {
    loading,
    hasMore,
    threshold: 100
  });

  useEffect(() => {
    if (showHistory) {
      getHistory(true);
    }
  }, [showHistory]);

  return (
    <div
      className={clsx("pt-[0px] text-[#2B3337]", isMobile ? "p-0" : "p-[18px]")}
    >
      <div className="px-[12px] h-[45px] flex items-center text-[12px]">
        {COLUMNS.map((column) => (
          <div
            key={column.key}
            className={`flex items-center`}
            style={{
              width: column.width,
              justifyContent:
                column.align === "left"
                  ? "flex-start"
                  : column.align === "right"
                  ? "flex-end"
                  : "center"
            }}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div
        ref={containerRef}
        className={clsx(
          "overflow-y-auto",
          isMobile ? "max-h-[70vh] min-h-[400px]" : "h-[350px]"
        )}
      >
        {loading && (
          <div className="text-[14px] text-[#5E6B7D] w-full h-[300px] flex items-center justify-center">
            <Loading size={20} />
          </div>
        )}
        {data.length > 0 && (
          <div className="text-[12px]">
            {data.map((record: any) => (
              <div
                key={record.id}
                className={clsx(
                  "mb-[6px] px-[12px] flex items-center h-[50px] rounded-[8px] bg-[flex items-center bg-[#F2F2F299]"
                )}
              >
                {COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    className={`flex items-center`}
                    style={{
                      width: column.width,
                      justifyContent:
                        column.align === "left"
                          ? "flex-start"
                          : column.align === "right"
                          ? "flex-end"
                          : "center"
                    }}
                  >
                    {column.key === "date" &&
                      dayjs(record.updated_at).format("HH:mm D MMM, YYYY")}
                    {column.key === "volume" &&
                      `${record.volume} ${
                        itemsMap[
                          record.token + "_" + record.config?.token_volume
                        ]?.name
                      }`}
                    {["number", "reward"].includes(column.key) &&
                      record[column.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {data.length === 0 && !loading && (
          <Empty
            text="No data"
            className="h-[300px] flex items-center justify-center"
          />
        )}
        {data.length > 0 && (
          <LoadingMore
            loading={isLoading}
            hasMore={hasMore}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}

const COLUMNS = [
  {
    key: "date",
    label: "Date",
    width: "55%",
    align: "left"
  },
  {
    key: "volume",
    label: "Redeem",
    width: "20%",
    align: "center"
  },
  {
    key: "reward",
    label: "PTS Used",
    width: "25%",
    align: "right"
  }
];
