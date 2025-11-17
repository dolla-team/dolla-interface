import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";

export default function Top() {
  const { userInfo } = useAuth() || {};

  return (
    <div className="p-[16px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px] w-full">
          <Avatar
            size={46}
            src={userInfo?.icon}
            address={userInfo?.user}
            className="border-2 border-[#FFFFFFCC] rounded-[6px] text-[26px]"
          />
          <div className="text-black w-[calc(100%-90px)]">
            <div className="text-[16px] font-bold whitespace-nowrap text-ellipsis overflow-hidden">
              {userInfo?.name}
            </div>
            <div className="flex items-center gap-[6px]">
              <span className="text-[12px]">
                {formatAddress(userInfo?.user)}
              </span>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center border border-[#E4E4E4] rounded-full bg-[#F2F2F299] px-[10px] gap-[4px]">
          <div className="w-[7px] h-[7px] rounded-full bg-[#10FFBF]" />
          <img className="w-[20px] h-[20px]" src="/chains/bera-1.png" />
        </div> */}
      </div>
    </div>
  );
}
