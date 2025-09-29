import BackIcon from "@/sections/wallet/back-icon";
import Tokens from "../info/tokens";

export default function TokenSelector({
  onBack,
  onSelect,
  title
}: {
  onBack: () => void;
  onSelect: (token: any) => void;
  title: string;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={onBack}
      >
        <BackIcon />
        <div className="text-black">{title}</div>
      </div>
      <div className="mt-[20px]">
        <div className="text-[16px] text-black mb-[10px] text-center">
          Choose Token
        </div>
        <Tokens onClick={onSelect} />
      </div>
    </div>
  );
}
