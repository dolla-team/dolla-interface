import StarIcon from "./star-icon";
import clsx from "clsx";

export default function SellerLevel({ isSmall = false }: any) {
  return null;
  return (
    <div
      className={clsx(
        "relative flex items-center rounded-[16px] border border-[#6A5D3A] bg-[#35302B]",
        isSmall ? "pl-[14px] pr-[6px] h-[12px]" : "pl-[18px] pr-[6px] h-[16px]"
      )}
    >
      <span
        className={clsx(
          "text-[#FFE9B2]",
          isSmall ? "text-[8px]" : "text-[10px]"
        )}
      >
        4.2
      </span>
      <StarIcon
        className={clsx(
          "absolute",
          isSmall
            ? "w-[14px] h-[14px] top-[-2px] left-[-2px]"
            : "w-[18px] h-[18px] top-[-2px] left-[-2px]"
        )}
      />
    </div>
  );
}
