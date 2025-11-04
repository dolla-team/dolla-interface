import clsx from "clsx";
import TopItemBg from "./item-bg";
import Avatar from "@/components/avatar";
import LevelIcon from "@/components/icons/level-icon";

export default function TopItem({ className, number }: any) {
  return (
    <div
      className={clsx(
        "relative justify-center rounded-[20px] border border-[#E4E4E4] bg-white shadow-[0px_-10px_30px_0px_rgba(223,220,255,0.60)]",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center h-[calc(100%-76px)]">
        <Avatar size={54} email="A" />
        <div className="flex items-center gap-[6px] mt-[6px]">
          <div className="text-[14px] text-blackfont-[500] max-w-[100px] truncate">
            11bbcc
          </div>
          <div className="flex items-center">
            <LevelIcon size={15} className="relative z-[2]" />
            <span className="ml-[-14px] pl-[16px] pr-[6px] text-[8px] text-right text-white border border-white bg-[#3C3C3C] rounded-[12px]">
              {1}
            </span>
          </div>
        </div>
        <div className="text-[26px] text-black font-[700]">11bbcc</div>
      </div>
      <div className="absolute bottom-0 left-0 flex flex-col items-center justify-center w-full h-[86px]">
        <div className="relative z-[2] px-[26px] rounded-[10px] h-[30px] flex items-center justify-center gap-[10px] border border-[#F2F2F233] bg-[#0000001A] text-[14px] font-[500] text-white">
          <span>#237</span>
          <span>0.1 BTC</span>
        </div>
        <div className="mt-[6px] relative z-[2] flex items-center justify-center gap-[8px] text-[12px] text-white">
          <span>$10</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
          >
            <path
              d="M9 3.73524C10.3333 4.50504 10.3333 6.42954 9 7.19934L3 10.6634C1.66666 11.4332 -5.6841e-07 10.471 -5.01112e-07 8.93139L-1.9827e-07 2.00318C-1.30972e-07 0.463581 1.66667 -0.498668 3 0.271133L9 3.73524Z"
              fill="white"
            />
          </svg>
          <span>$11,035.62</span>
        </div>
        <TopItemBg number={number} />
      </div>
    </div>
  );
}
