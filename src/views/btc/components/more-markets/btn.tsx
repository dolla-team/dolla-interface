import clsx from "clsx";

export default function MoreMarketBtn({
  className,
  onClick
}: {
  className?: string;
  onClick?: (e: any) => void;
}) {
  return (
    <button
      style={{
        WebkitTextStrokeWidth: "1px",
        WebkitTextStrokeColor: "#5E3737"
      }}
      className={clsx(
        "w-[168px] h-[34px] bg-[#1A1E24] rounded-b-[6px] border border-[#3C3420] border-t-0 button pl-[10px] flex justify-center items-center gap-[12px] text-[#FFEF43] text-[16px] font-bold",
        className
      )}
      onClick={onClick}
    >
      <span>More Markets</span>
      <span>〉</span>
    </button>
  );
}
