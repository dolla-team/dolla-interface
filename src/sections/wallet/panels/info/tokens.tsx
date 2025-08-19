import config from "@/config/bera";
import Empty from "./empty";

export default function Tokens() {
  // return <Empty onDeposit={() => {}} />;
  return (
    <div>
      <Item />
    </div>
  );
}

const Item = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-[14px]">
        <div className="w-[32px] h-[32px] rounded-full relative">
          <img
            src={config.purchaseToken.icon}
            className="w-full h-full object-cover"
          />
          <img
            src="/chains/bera-1.png"
            className="w-[16px] h-[16px] absolute bottom-[-4px] right-[-4px]"
          />
        </div>
        <div>
          <div>
            <span className="text-[14px] text-white">
              {config.purchaseToken.symbol}{" "}
            </span>
            <span className="text-[12px] text-[#8A87AA]">(Berachain)</span>
          </div>
          <div className="text-[12px] text-[#8A87AA]">$100</div>
        </div>
      </div>
      <div>
        <div className="text-[14px] text-white">500</div>
        <div className="text-[12px] text-[#8A87AA]">$100</div>
      </div>
    </div>
  );
};
