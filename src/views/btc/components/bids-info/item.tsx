import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import dayjs from "dayjs";

export default function Item({ data }: any) {
  const time = dayjs(data.time).fromNow().includes("a few seconds")
    ? "just now"
    : dayjs(data.time).fromNow();
  return (
    <div className="w-[288px] h-[42px] mt-[10px] p-[6px] rounded-[10px] border border-[#F2F2F233] bg-[#F2F2F21A] backdrop-blur-[10px] flex items-center">
      <Avatar
        src={data.user_icon}
        address={data.user}
        size={30}
        className="border border-[#131417] mr-[6px] text-[16px]"
      />
      <div className="text-[10px] font-bold truncate mr-[3px] shrink-0 max-w-[100px]">
        {data.user_name || formatAddress(data.user, 3)}
      </div>
      <div className="text-[12px] font-bold text-[#FFEF43] mr-[3px]">
        bid ${data.times}
      </div>
      <div className="text-[10px] font-bold">{time}</div>
    </div>
  );
}
