import Refresh from "@/components/icons/refresh";
import clsx from "clsx";

export default function RefreshIcon({
  refreshing,
  onClick
}: {
  refreshing: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "flex items-center gap-[7px] text-[#5E6B7D]",
        !refreshing && "button"
      )}
      onClick={onClick}
    >
      <Refresh size={14} refreshing={refreshing} />
      <span className="text-[12px]">Refresh</span>
    </button>
  );
}
