import dayjs from "@/libs/dayjs";

export default function SoldOut({ pool }: { pool: any }) {
  return (
    <div className="absolute right-[40px] top-[20px] w-[86px] h-[86px] border-[4px] border-[#D9D9D9] rounded-full p-[10px]">
      <div className="relative w-[58px] h-[58px] border-[2px] border-[#D9D9D9] rounded-full" />
      <div className="bg-white rotate-[15deg] text-center w-[132px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-[20px] font-[700] text-black leading-[90%] whitespace-nowrap">
          {pool?.status === 2 ? "ENDED" : "CANCELED"}
        </div>
        <div className="text-[12px] text-[#8A87AA]">
          {dayjs(pool?.result_time).format("YYYY/MM/DD")}
        </div>
      </div>
    </div>
  );
}
