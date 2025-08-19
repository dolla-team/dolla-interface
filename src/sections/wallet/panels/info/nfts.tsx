import Empty from "./empty";
import Button from "@/components/button/v2";

export default function Nfts() {
  // return <Empty onDeposit={() => {}} />;
  return (
    <div className="flex gap-[20px] flex-wrap">
      <Item />
    </div>
  );
}

const Item = () => {
  return (
    <div className="w-[178px] relative group">
      <div className="absolute top-0 left-0 w-[178px] h-[178px] rounded-[10px] bg-[#00000080] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button className="button w-[150px] h-[36px] !text-[12px]">
          Creat Market
        </Button>
        <Button className="button w-[150px] h-[36px] !text-[12px] !bg-[#1A1E24] mt-[10px]">
          Send
        </Button>
      </div>
      <img
        src="/nfts/steady-teddys/1018.webp"
        className="w-full h-[178px] object-cover rounded-[10px] border border-[#434343CC] button"
      />
      <div className="text-[12px] font-semibold text-white mt-[10px]">
        Steady Teddy #6257
      </div>
      <div className="text-[12px] flex gap-[4px] items-center mt-[4px]">
        <span className="text-[#8A87AA]">Token ID</span>
        <span className="text-white">#100</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path d="M1 9.5L9.5 1M9.5 1H1M9.5 1V9.5" stroke="white" />
        </svg>
      </div>
      <div className="text-[12px] mt-[4px]">
        <span className="text-[#8A87AA]">Valued</span>{" "}
        <span className="text-white">$868.6</span>
      </div>
    </div>
  );
};
