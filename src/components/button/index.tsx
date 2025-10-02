import clsx from "clsx";
import Loading from "../icons/loading";
import { useMemo } from "react";

export default function Button({
  children,
  disabled,
  onClick = () => {},
  className,
  loading,
  isPrimary = true,
  soon
}: {
  children?: React.ReactNode;
  onClick?: (ev: any) => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  isPrimary?: boolean;
  soon?: boolean;
}) {
  const size = useMemo(() => {
    if (className?.includes("h-")) {
      const match = className.match(/h-\[(\d+)px\]/);
      if (match) {
        return parseInt(match[1]) * 0.6;
      }
    }
    return 20;
  }, [className]);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-[12px] flex items-center justify-center relative",
        isPrimary && "bg-white text-[12px] text-[#2B3337] font-[500]",
        className,
        disabled
          ? "opacity-50 cursor-not-allowed"
          : !soon && "cursor-pointer button"
      )}
    >
      {soon && (
        <div className="absolute right-[-10px] top-[-10px] flex justify-center items-center text-[12px] font-[500] text-white h-[20px] px-[5px] rounded-[6px] bg-[#4C4C4C]">
          soon
        </div>
      )}
      {loading ? <Loading size={Math.min(size, 20)} /> : children}
    </button>
  );
}
