import Loading from "@/components/icons/loading";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { useCallback, useState } from "react";

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

    const [showOnlyYouParticipate, setShowOnlyYouParticipate] = useState(false);
    const [isScroll, setIsScroll] = useState(false);
    const isMobile = useIsMobile();

    const handleScroll = useCallback((e: any) => {
        setIsScroll(e.target.scrollLeft > 0);
    }, []);

  

    return (
        <div className="mt-[20px] text-white pb-[20px]">
            <div className="flex items-center justify-between">
                <div>Ended Market</div>
                <div onClick={() => setShowOnlyYouParticipate(!showOnlyYouParticipate)} className="flex items-center justify-between cursor-pointer">
                    <div className="border border-[#6A5D3A] rounded-full w-[15px] h-[15px] flex items-center justify-center mr-2">
                        {
                            showOnlyYouParticipate && <div className="w-[9px] h-[9px] bg-[#FFC42F] rounded-full"></div>
                        }
                    </div>
                    <div>You participate only</div>
                </div>
            </div>
            <div onScroll={handleScroll} className="w-full overflow-x-scroll relative mt-[10px]">
                <div className={clsx("", isMobile ? "w-[800px] " : "w-full")}>
                    <table className="sticky-table w-full">
                        <thead>
                            <tr className="text-[14px] text-[#BBACA6] ">
                                {
                                    COLUMNS.map((column) => (
                                        <th style={{
                                            width: column.width,
                                        }} className={clsx('text-left pb-[10px]', column.isFloat ? "sticky-column pl-2" : "", column.isFloat && isScroll ? "shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] bg-[#35302B]" : "")} key={column.key}>{column.label}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody >
                            {!loading && data?.length > 0 && data?.map((record: any) => (
                                <tr
                                    key={record.id}
                                    className={clsx(
                                        "relative h-[50px]  text-[16px] "
                                    )}
                                >
                                    {COLUMNS.map((column, idx) => (
                                        <td
                                            key={column.key}
                                            className={clsx(
                                                `pl-1 bg-[#00000033]`,
                                                column.isFloat ? "sticky-column" : "",
                                                column.isFloat && isScroll ? "shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] bg-[#35302B]" : "",
                                                idx === 0 ? "rounded-l-[8px] pl-2" : "",
                                                idx === COLUMNS.length - 1 ? "rounded-r-[8px]" : ""
                                            )}
                                            style={{
                                                width: column.width,
                                            }}
                                        >
                                            {column.key === "winner" ? (
                                                <div className="flex items-center gap-[4px]">
                                                    {record[column.key]}
                                                </div>
                                            ) : (
                                                record[column.key]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    {loading && (
                        <div className="text-[14px] text-[#5E6B7D] w-full  h-[50px] flex items-center justify-center">
                            <Loading size={20} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

const COLUMNS = [
    {
        key: "pool_id",
        label: "Marked ID",
        width: "16.66%",
        align: "left",
        isFloat: true
    },
    {
        key: "purchase_amount",
        label: "Market Size",
        width: "16.66%",
        align: "left"
    },
    {
        key: "random",
        label: "Random No.",
        width: "16.66%",
        align: "left"
    },
    {
        key: "status",
        label: "Win No.",
        width: "16.66%",
        align: "left"
    },
    {
        key: "settle",
        label: "Settle Tx",
        width: "16.66%",
        align: "left"
    },
    {
        key: "winner",
        label: "Winner",
        width: "16.66%",
        align: "left"
    }
];
