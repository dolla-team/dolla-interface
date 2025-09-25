import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import dayjs from "dayjs";

export default function Item({ data }: any) {
  return (
    <div className="w-[248px] h-[42px] mt-[10px] p-[6px] rounded-[23px] border border-[#FFE9B2] bg-white/10 backdrop-blur-[10px] flex items-center">
      <Avatar
        address={data.user}
        email={data.user_email}
        size={30}
        className="border border-[#131417] mr-[6px]"
      />
      <div className="text-[10px] font-bold truncate mr-[3px] shrink-0">
        {formatAddress(data.user, 3)}
      </div>
      <div className="text-[12px] font-bold text-[#FFEF43] mr-[3px]">
        bid {data.times}
      </div>
      <div className="text-[10px] font-bold">{dayjs(data.time).fromNow()}</div>
    </div>
  );
}
