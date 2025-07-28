import Loading from "@/components/icons/loading";
import Modal from "@/components/modal";
import clsx from "clsx";
import useProvably from "./use-provably";

export default function ProvablyFair({ open, onClose }: { open: boolean, onClose: () => void }) {
  const loading = false;
  const data: any[] = [
    {
      id: 1,
      pool_id: "BTC-2024-001",
      purchase_amount: "$1,250.00",
      prize: "0x7a8b...c4d2",
      status: "123456789"
    }
  ];

  const { data: provablyData, loading: provablyLoading } = useProvably();

  console.log('provablyData:', provablyData);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[672px] h-[444px] bg-[#35302B] border border-[#6A5D3A] rounded-[16px]">
        <div className="flex justify-between items-center rounded-t-[16px] h-[54px] px-[30px] bg-[#00000033]">
          <div className="text-[20px] font-bold text-white">Provably Fair</div>
          <button className="cursor-pointer" onClick={onClose}>
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
        <div className="p-[30px] pt-[20px]">
          <div className="text-[16px] text-[#BBACA6]">Verify</div>
          <div className="flex items-center gap-[18px] mt-[10px]">
            <input
              className="w-[544px] h-[46px] bg-black/20 rounded-[10px] p-[15px] text-[16px] text-white"
              placeholder="Enter Market ID"
            />
            <button className="w-[68px] h-[28px] rounded-[8px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] text-[16px] text-black">
              Verify
            </button>
          </div>
          {/* <div className="w-[544px] flex items-center gap-[12px] mt-[14px] text-white">
            <input
              className="w-1/3 h-[46px] bg-[#00000033] rounded-[10px] p-[15px] text-[16px]"
              placeholder="Server Seed"
            />
            <input
              className="w-1/3 h-[46px] bg-[#00000033] rounded-[10px] p-[15px] text-[16px]"
              placeholder="Public Seed"
            />
            <input
              className="w-1/3 h-[46px] bg-[#00000033] rounded-[10px] p-[15px] text-[16px]"
              placeholder="EOS Block"
            />
          </div> */}
          <div className="mt-[20px] text-white">
            <div className="px-[12px] h-[45px] flex items-center text-[14px] text-[#5E6B7D]">
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
            {loading && (
              <div className="text-[14px] text-[#5E6B7D] w-full  h-[50px] flex items-center justify-center">
                <Loading size={20} />
              </div>
            )}
            {data.length > 0 && (
              <div className="text-[14px]">
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
                        {column.key === "winner" ? (
                          <div className="flex items-center gap-[4px]">
                            {record[column.key]}
                          </div>
                        ) : (
                          record[column.key]
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

const COLUMNS = [
  {
    key: "pool_id",
    label: "Marked ID",
    width: "25%",
    align: "left"
  },
  {
    key: "purchase_amount",
    label: "Market Size",
    width: "25%",
    align: "left"
  },
  {
    key: "winner",
    label: "Random No.",
    width: "25%",
    align: "left"
  },
  {
    key: "status",
    label: "Win No.",
    width: "25%",
    align: "left"
  },
  {
    key: "status",
    label: "Settle Tx",
    width: "25%",
    align: "left"
  },
  {
    key: "status",
    label: "Winner",
    width: "25%",
    align: "left"
  }
];
