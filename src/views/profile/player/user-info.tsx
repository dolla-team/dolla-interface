import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import Avatar from "@/components/avatar";

export default function UserInfo() {
  const { userInfo } = useAuth();

  return (
    <div className="flex items-center gap-[20px]">
      <Avatar
        size={56}
        className="rounded-[8px] border border-[2px] border-[#FFFFFFCC] text-[28px]"
        address={userInfo?.user}
        src={userInfo?.icon}
      />
      <div className="text-white">
        <div className="text-[20px]">{userInfo?.username}</div>
        <div className="text-[14px]">{formatAddress(userInfo?.user)}</div>
      </div>
    </div>
  );
}
