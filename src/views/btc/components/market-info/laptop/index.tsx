import Progress from "../progress";
import { useBtcContext } from "../../../context";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import Avatar from "@/components/avatar";
import SellerLevel from "@/components/seller-level";
import { formatAddress } from "@/utils/format/address";
import MoreIcon from "./more-icon";
import { getAnchorPrice } from "@/utils/pool";

export default function MarketInfo() {
  const { pool } = useBtcContext();

  return (
    pool?.status !== 2 && (
      <div className="absolute left-[20px] bottom-[50%] w-[244px]">
        <div className="flex items-center justify-between">
          <div className="h-[40px] flex items-center gap-[12px]">
            <Avatar
              size={35}
              src={pool?.user_info?.icon}
              email={pool?.user_info?.show_email}
              address={pool?.user_info?.user}
              className="rounded-[12px] text-[16px]"
            />
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] text-white">Seller</span>
                <SellerLevel />
              </div>
              <div className="">
                <span className="text-[14px] text-white">
                  {pool?.user_info?.name || formatAddress(pool?.user)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-[20px]">
          {pool?.participants < 10 && (
            <div className="text-[12px] text-white/50 mr-[6px]">Player</div>
          )}
          {pool?.degen_players?.map((item: any, index: number) => (
            <Avatar
              key={index}
              size={22}
              src={item.icon}
              email={item?.email_desensitization || item?.name}
              address={item?.user}
              className={clsx(
                "rounded-[50%] text-[12px] shrink-0",
                index !== 0 && "ml-[-6px]"
              )}
            />
          ))}

          {pool?.degen_players?.length >= 10 && (
            <MoreIcon className="ml-[-6px] relative z-[2] shrink-0" />
          )}
          <div className="text-[12px] text-white ml-[6px]">
            {pool?.participants || 0}
          </div>
        </div>
        <div className="mt-[10px] flex justify-between items-center">
          <div>
            <div className="text-[12px] text-white/50">Valued</div>
            <div
              className={clsx(
                "text-[16px] font-[600]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white"
              )}
            >
              ${formatNumber(getAnchorPrice(pool?.anchor_price), 2, true)}
            </div>
          </div>
        </div>
        <div className="mt-[8px]">
          <Progress data={pool} />
        </div>
      </div>
    )
  );
}
