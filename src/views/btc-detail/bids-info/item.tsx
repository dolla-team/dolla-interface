import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import dayjs from "dayjs";

export default function Item({ data }: { data: any }) {
  const time = dayjs(data.time).fromNow().includes("a few seconds")
    ? "just now"
    : dayjs(data.time).fromNow();

  return (
    <div className="rounded-[24px] bg-linear-to-r from-[#E4E4E4] to-[#E4E4E400] p-[1px] inline-block">
      <div className="p-[6px] pr-[30px] h-[40px] bg-linear-to-r from-[#B2FFB6] to-[#B2FFB600] rounded-[24px] flex items-center gap-[6px]">
        <div className="border-[2px] border-[#131417] rounded-full w-[34px] h-[34px]">
          <Avatar
            src={data.user_icon}
            address={data.user}
            size={30}
            className="rounded-full"
          />
        </div>

        <div className="text-[12px] text-[#3B3951] font-[300] flex items-center gap-[6px]">
          <span className="whitespace-nowrap">
            {data.user_name || formatAddress(data.user, 3)} bid
          </span>
          <span className="text-[14px] font-[500] text-[#3B3951]">
            ${data.times}
          </span>
          <span className="whitespace-nowrap">{time}</span>
        </div>
      </div>
    </div>
  );
}
