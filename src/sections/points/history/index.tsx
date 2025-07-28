import Modal from "@/components/modal";
import Loading from "@/components/icons/loading";
import clsx from "clsx";
import useHistory from "../use-history";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import LoadingMore from "@/components/loading/loading-more";
import { useEffect } from "react";
import dayjs from "dayjs";

export default function History({
  showHistory,
  onClose,
  itemsMap
}: {
  showHistory: boolean;
  onClose: () => void;
  itemsMap: any;
}) {
  const { data, loading, hasMore, getHistory } = useHistory();
  const { containerRef, isLoading } = useInfiniteScroll(getHistory, {
    loading,
    hasMore,
    threshold: 100
  });

  useEffect(() => {
    if (showHistory) {
      getHistory();
    }
  }, [showHistory]);

  return (
    <Modal open={showHistory} onClose={onClose}>
      <div className="w-[618px] rounded-[16px] border border-[#6A5D3A] bg-[#35302B]">
        <div className="h-[54px] bg-[#00000033] rounded-t-[16px] flex items-center justify-between px-[16px]">
          <div className="text-[20px] text-white">Points Redemption</div>
          <button className="w-[24px] h-[24px] button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
            >
              <path
                d="M5 4.57422L8 0.592773H10L6 5.90137L10 11.21H8L5 7.22852L2 11.21H0L4 5.90137L0 0.592773H2L5 4.57422Z"
                fill="#BBACA6"
              />
            </svg>
          </button>
        </div>
        <div className="p-[18px] pt-[0px]">
          <div className="px-[12px] h-[45px] flex items-center text-[14px] text-[#BBACA6]">
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
          <div ref={containerRef} className="h-[400px] overflow-y-auto">
            {loading && (
              <div className="text-[14px] text-[#5E6B7D] w-full h-[300px] flex items-center justify-center">
                <Loading size={20} />
              </div>
            )}
            {data.length > 0 && (
              <div className="text-[16px] text-white">
                {data.map((record: any) => (
                  <div
                    key={record.id}
                    className={clsx(
                      "mb-[6px] px-[12px] flex items-center h-[50px] rounded-[4px] bg-[flex items-center bg-[#00000033]"
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
                          dayjs(record.updated_at).format("hh:mm D MMM, YYYY")}
                        {column.key === "volume" &&
                          `${record.volume} ${
                            itemsMap[record.token + "_" + record.volume].name
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
              <div className="text-[14px] text-[#BBACA6] w-full h-[300px] flex items-center justify-center">
                No data
              </div>
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
      </div>
    </Modal>
  );
}

const COLUMNS = [
  {
    key: "date",
    label: "Date",
    width: "30%",
    align: "left"
  },
  {
    key: "volume",
    label: "Redeem",
    width: "25%",
    align: "center"
  },
  {
    key: "number",
    label: "Amount",
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
