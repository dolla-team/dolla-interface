import Loading from "@/components/icons/loading";
import Pagination from "@/components/pagination";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { useCallback, useState } from "react";

export default function VerifyList({ hasNext, list, loading, setYouParticipateOnly, youParticipateOnly, offset, setOffset }: { hasNext: boolean, list: any[], loading: boolean, setYouParticipateOnly: (value: boolean) => void, youParticipateOnly: boolean, offset: number, setOffset: (value: number) => void }) {
    const [isScroll, setIsScroll] = useState(false);
    const isMobile = useIsMobile();

    const handleScroll = useCallback((e: any) => {
        if (isMobile) {
            setIsScroll(e.target.scrollLeft > 0);
        }
    }, [isMobile]);

    console.log('list:', list);

    return (
        <div>
            <div className="mt-[20px] h-[444px] overflow-y-auto text-white pb-[20px]">
                <div className="flex items-center justify-between pl-[10px]">
                    <div>Ended Market</div>
                    <div onClick={() => setYouParticipateOnly(!youParticipateOnly)} className="flex items-center justify-between cursor-pointer">
                        <div className="border border-[#6A5D3A] rounded-full w-[15px] h-[15px] flex items-center justify-center mr-2">
                            {
                                youParticipateOnly && <div className="w-[9px] h-[9px] bg-[#FFC42F] rounded-full"></div>
                            }
                        </div>
                        <div>You participate only</div>
                    </div>
                </div>
                <div onScroll={handleScroll} className="w-full overflow-x-scroll relative mt-[10px]">
                    <div className={clsx("", isMobile ? "w-[800px]" : "w-full pl-[10px]")}>
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
                                {!loading && list?.length > 0 && list?.map((record: any) => (
                                    <>
                                        <tr
                                            key={record.id}
                                            className={clsx(
                                                "relative h-[50px]  text-[16px]"
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
                                                            <img src="/avatar/avatar-default.png" className="w-[16px] h-[16px]" />
                                                            {record[column.key]}
                                                        </div>
                                                    ) : (
                                                        record[column.key]
                                                    )}

                                                    {
                                                        record.userDrawAttempt && idx === 0 && (
                                                            <div className="absolute top-[50%] -translate-y-[50%] left-[-10px]">
                                                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M11 5.26795C12.3333 6.03775 12.3333 7.96225 11 8.73205L3.5 13.0622C2.16666 13.832 0.499999 12.8697 0.499999 11.3301L0.5 2.66987C0.5 1.13027 2.16667 0.168021 3.5 0.937822L11 5.26795Z" fill="#FFC42F" />
                                                                </svg>
                                                            </div>
                                                        )
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td colSpan={COLUMNS.length} className="w-full  h-[10px] "></td>
                                        </tr>
                                    </>
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
            <div className={clsx("flex py-[5px]", isMobile ? "justify-center" : "justify-end")}>
                <Pagination hasNextPage={hasNext} current={offset + 1} onNext={() => { setOffset(offset + 1) }} onPrev={() => { setOffset(offset - 1) }} />
            </div>
        </div>
    );
}

const COLUMNS = [
    {
        key: "marketId",
        label: "Marked ID",
        width: "20%",
        align: "left",
        isFloat: true
    },
    {
        key: "marketSize",
        label: "Market Size",
        width: "20%",
        align: "left"
    },
    {
        key: "winNo",
        label: "Win No. Range",
        width: "20%",
        align: "left"
    },
    {
        key: "settleTX",
        label: "Settle Tx",
        width: "20%",
        align: "left"
    },
    {
        key: "winner",
        label: "Winner",
        width: "20%",
        align: "left"
    }
];
