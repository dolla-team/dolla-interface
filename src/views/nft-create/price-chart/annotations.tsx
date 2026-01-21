import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";

export default function Annotations({
  anchorPrice,
  expectedValue,
  className
}: {
  anchorPrice?: number;
  expectedValue?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "absolute z-[1] right-[12px] top-0 rounded-[6px] py-[12px] pl-[8px] pr-[3px] font-[400] leading-[100%] text-[10px] text-[#5E6B7D]",
        "max-md:w-[calc(100%_-_20px)] max-md:left-[10px]",
        className
      )}
    >
      <div className="flex items-center gap-[5px]">
        <div className="w-[14px] h-[2px] bg-[#57FF70] rounded-[2px]" />
        <span>Probability Weighted Return</span>
      </div>
      <div className="flex items-center gap-[5px] mt-[9px]">
        <div className="w-[14px] h-[1px] border-b border-b-[#8C8B8B] border-dashed" />
        <span>Anchor Price = ${formatNumber(anchorPrice, 2, true)}</span>
      </div>
      <div className="flex items-center gap-[5px] mt-[9px]">
        <div className="w-[14px] h-[1px] border-b border-b-[#FFC42F] border-dashed" />
        <span>Expected Value = ${formatNumber(expectedValue, 2, true)}</span>
      </div>
      <div className="flex items-center mt-[7px]">
        <div className="w-[19px] h-[8px] bg-[rgba(255,90,151,0.50)] rounded-[1px] mr-[3px]" />
        <span className="ml-[6px]">Loss</span>
        <div className="w-[19px] h-[8px] bg-[rgba(87,255,112,0.50)] rounded-[1px] mr-[3px] ml-[45px]" />
        <span className="ml-[6px]">Premium</span>
      </div>
    </div>
  );
}
