import Avatar from "@/components/avatar";
import clsx from "clsx";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import dayjs from "@/libs/dayjs";

export default function ProgressAvatar({
  data,
  winnerBid,
  className
}: {
  data: any;
  winnerBid: any;
  className?: string;
}) {
  return (
    <Popover
      content={
        <div className="px-[8px] py-[6px] flex items-center gap-[40px] text-[12px] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="font-[500] text-black">${winnerBid.times}</div>
          <div className="text-[#5E6B7D] font-[300] leading-[120%]">
            {dayjs(winnerBid.created_at).format("HH:mm DD MMM, YYYY")}
          </div>
        </div>
      }
      placement={PopoverPlacement.TopLeft}
      trigger={PopoverTrigger.Hover}
    >
      <div
        className={clsx(
          "w-[28px] h-[28px] border border-[#DD9000] rounded-[6px]",
          className
        )}
      >
        <Avatar
          size={26}
          src={data.winner_user_info?.icon}
          address={data.winner_user_info?.user}
          className={clsx("text-[12px] !rounded-[4px]", className)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          className="absolute bottom-[-5px] left-[50%] translate-x-[-50%]"
        >
          <path
            d="M3.18912 4.8764C3.58825 5.42946 4.41175 5.42946 4.81088 4.87641L7.1861 1.58521C7.6634 0.923842 7.19083 0 6.37522 0H1.62478C0.809174 0 0.336598 0.923841 0.813896 1.58521L3.18912 4.8764Z"
            fill="#DD9000"
          />
        </svg>
      </div>
    </Popover>
  );
}
