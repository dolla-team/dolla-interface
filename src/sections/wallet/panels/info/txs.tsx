import config from "@/config/bera";
import Empty from "./empty";

export default function Txs() {
  // return <Empty  />;
  return (
    <div>
      <Item />
    </div>
  );
}

const Item = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-[8px]">
        <div className="relative flex">
          <img
            src={config.purchaseToken.icon}
            className="w-[32px] h-[32px] rounded-full object-cover"
          />
          <img
            src={config.purchaseToken.icon}
            className="w-[32px] h-[32px] rounded-full object-cover ml-[-10px]"
          />
        </div>
        <div>
          <div className="text-[14px] text-white">Swap</div>
          <div className="text-[10px] text-[#8A87AA]">From USDC to HONEY</div>
        </div>
      </div>
      <div>
        <div className="text-[14px] text-white">+200 HONEY</div>
        <div className="text-[10px] text-[#8A87AA]">-200 USDC</div>
      </div>
    </div>
  );
};
