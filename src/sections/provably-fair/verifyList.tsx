import Loading from "@/components/icons/loading";
import clsx from "clsx";

export default function VerifyList() {
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

    return (
        <div>
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
