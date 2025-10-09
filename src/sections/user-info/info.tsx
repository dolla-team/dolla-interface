import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import CopyIcon from "@/components/icons/copy";
import { useAuth } from "@/contexts/auth";
import { useUser } from "@privy-io/react-auth";
import useCopy from "@/hooks/use-copy";

export default function Info() {
  const { userInfo } = useAuth();
  const { onCopy } = useCopy();
  const { user } = useUser();
  return (
    <div className="flex gap-[8px] items-center">
      <Avatar
        size={50}
        address={userInfo?.user}
        email={userInfo?.show_email}
        src={userInfo?.icon}
        className="shrink-0 border-[2px] border-[#FFFFFFCC]"
      />
      <div className="flex-1 w-0">
        <div className="text-[18px] font-semibold text-white truncate">
          {user?.email?.address}
        </div>
        <div className="flex items-center gap-[3px]">
          <span className="text-[12px] text-white">
            {formatAddress(userInfo?.user)}
          </span>
          <button
            className="button"
            onClick={() => {
              onCopy(userInfo?.user);
            }}
          >
            <CopyIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
