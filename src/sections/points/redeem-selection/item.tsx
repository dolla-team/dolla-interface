import PointIcon from "@/components/icons/point-icon";
import LockIcon from "@/components/icons/lock";
import clsx from "clsx";
import { formatNumber } from '@/utils/format/number'

const BG: Record<string, string> = {
  BTC: "bg-[radial-gradient(69.72%_55.78%_at_50%_20%,_rgba(255,_189,_83,_0.90)_0%,_rgba(255,_189,_83,_0.00)_100%)] bg-[#22201D]",
  USDT: "bg-[radial-gradient(69.72%_55.78%_at_50%_20%,_rgba(83,255,180,_0.90)_0%,_rgba(83,255,180,_0.00)_100%)] bg-[#22201D]",
  SOL: "bg-[radial-gradient(69.72%_55.78%_at_50%_20%,_rgba(117,_83,_255,_0.90)_0%,_rgba(117,_83,_255,_0.00)_100%)] bg-[#22201D]",
  "Free Bid":
    "bg-[url('/new-btc/bg.gif')] bg-size-[auto_150%] bg-center bg-no-repeat bg-clip-border"
};

export default function RedeemSelectionItem({
  data,
  onClick,
  className
}: {
  data: any;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'h-[224px] rounded-[16px] border border-[#6A5D3A] relative flex flex-col justify-between pb-[20px]',
        BG[data.name],
        className
      )}
    >
      <div className="flex-1 flex items-center">
        <img className="w-[80px] h-[80px] mx-auto mt-[20px]" src={data.icon} />
      </div>
      <div>
        {' '}
        <div className="text-center text-[16px] font-bold mt-[20px] text-white">
          {data.token_volume} {data.name}
        </div>
        <button
          className={clsx(
            'w-[158px] h-[40px] bg-linear-to-b from-[#FFF698] to-[#FFC42F] rounded-[8px] text-black text-[14px] font-[600] mx-auto mt-[20px] flex items-center justify-center gap-[8px]',
            !!onClick && !data.disabled ? 'button' : data.disabled ? 'opacity-50' : ''
          )}
          onClick={onClick}
        >
          <PointIcon size={22} />
          <span>{formatNumber(data.number, 0, true)}</span>
        </button>
      </div>
      {data.disabled && (
        <div className="w-full h-full absolute right-0 top-0 bg-[#231E13]/80 rounded-[16px] flex items-center justify-center">
          <LockIcon size={71} />
        </div>
      )}
    </div>
  )
}
