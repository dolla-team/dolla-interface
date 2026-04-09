import Avatar from '@/components/avatar'
import { formatAddress } from '@/utils/format/address'
import { useAuth } from '@/contexts/wallet'

export default function Info() {
  const { userInfo } = useAuth()

  return (
    <div className="flex gap-[8px] items-center px-[20px]">
      <Avatar
        size={50}
        address={userInfo?.user}
        src={userInfo?.icon}
        className="shrink-0 border-[2px] border-[#FFFFFFCC] text-[26px]"
      />
      <div className="flex-1 w-0">
        <div className="text-[18px] font-semibold text-white truncate">{userInfo?.name}</div>
        <div className="flex items-center gap-[3px]">
          <span className="text-[12px] text-white">{formatAddress(userInfo?.user)}</span>
        </div>
      </div>
    </div>
  )
}
