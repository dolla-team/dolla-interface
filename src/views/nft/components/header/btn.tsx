import clsx from "clsx";
import BtnBg from "./btn-bg";

export default function Btn({
  className,
  children,
  isBgReserve,
  onClick
}: {
  className?: string;
  children: React.ReactNode;
  isBgReserve?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={clsx(
        "w-[173px] h-[45px] text-[14px] text-white flex items-center justify-center button",
        className
      )}
      onClick={onClick}
    >
      <BtnBg
        className={clsx(
          "absolute top-0 left-0 w-full h-full",
          isBgReserve && "rotate-y-[180deg]"
        )}
      />
      {children}
    </div>
  );
}
