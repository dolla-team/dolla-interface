import BackIcon from "@/sections/wallet/back-icon";
import Tokens from "../info/tokens";

export default function TokenSelector({
  onBack,
  onSelect,
  title,
  className
}: {
  onBack: () => void;
  onSelect: (token: any) => void;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className="flex items-center gap-[10px] text-[14px] cursor-pointer button"
        onClick={onBack}
      >
        <BackIcon />
        <div className="text-black">{title}</div>
      </div>
      <div className="mt-[20px]">
        <div className="text-[16px] text-black font-[500] mb-[10px] text-center">
          Select Token
        </div>
        <Tokens onClick={onSelect} />
      </div>
    </div>
  );
}
