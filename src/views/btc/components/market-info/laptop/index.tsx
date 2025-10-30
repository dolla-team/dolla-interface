import Progress from "../progress";
import { useBtcContext } from "../../../context";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import Avatar from "@/components/avatar";
import SellerLevel from "@/components/seller-level";
import { formatAddress } from "@/utils/format/address";
import MoreIcon from "./more-icon";
import { getAnchorPrice } from "@/utils/pool";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";

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
            <div className="text-[12px] text-white/50 mr-[6px]">Bidders</div>
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
            <div className="text-[12px] text-white/50">Anchor Value</div>
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
        <div className="flex items-center mt-[60px] gap-[4px]">
          <span className="text-[12px] text-white/60">Dolla Probability</span>
          <ProbabilityInfo />
          <span className="text-[12px] text-white/60">=</span>
          <div
            className="text-[16px] font-[600]"
            style={{
              background:
                "linear-gradient(90deg, #A2623D 0%, #FFC42F 47.6%, #FFE9B2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            1/{formatNumber(getAnchorPrice(pool?.anchor_price || 0), 0, true)}
          </div>
        </div>
      </div>
    )
  );
}

const ProbabilityInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[330px] text-[#5E6B7D] text-[12px] font-[300] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          Dolla Probability
        </div>
      }
    >
      <button className="relative transition-opacity button flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 16C3.582 16 0 12.418 0 8C0 3.582 3.582 0 8 0C12.418 0 16 3.582 16 8C16 12.418 12.418 16 8 16ZM8 14.6667C11.682 14.6667 14.6667 11.682 14.6667 8C14.6667 4.318 11.682 1.33333 8 1.33333C4.318 1.33333 1.33333 4.318 1.33333 8C1.33333 11.682 4.318 14.6667 8 14.6667ZM7.33333 7.33333C7.33333 7.15652 7.40357 6.98695 7.5286 6.86193C7.65362 6.7369 7.82319 6.66667 8 6.66667C8.17681 6.66667 8.34638 6.7369 8.4714 6.86193C8.59643 6.98695 8.66667 7.15652 8.66667 7.33333V12C8.66667 12.1768 8.59643 12.3464 8.4714 12.4714C8.34638 12.5964 8.17681 12.6667 8 12.6667C7.82319 12.6667 7.65362 12.5964 7.5286 12.4714C7.40357 12.3464 7.33333 12.1768 7.33333 12V7.33333ZM7.93333 5.2C7.6858 5.2 7.4484 5.10167 7.27337 4.92663C7.09833 4.7516 7 4.5142 7 4.26667C7 4.01913 7.09833 3.78173 7.27337 3.6067C7.4484 3.43167 7.6858 3.33333 7.93333 3.33333C8.18087 3.33333 8.41827 3.43167 8.5933 3.6067C8.76833 3.78173 8.86667 4.01913 8.86667 4.26667C8.86667 4.5142 8.76833 4.7516 8.5933 4.92663C8.41827 5.10167 8.18087 5.2 7.93333 5.2Z"
            fill="#8A87AA"
          />
        </svg>
      </button>
    </Popover>
  );
};
