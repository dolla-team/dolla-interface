import HotMarkets from "./hot-markets";
import Banner from "./banner";
import LucyDraw from "@/sections/lucy-draw";
import TopWinners from "./top-winners";
import Markets from "./markets";

export default function Home() {
  return (
    <>
      <LucyDraw from="home" />
      <div className="w-[1158px] mx-auto pt-[30px] pb-[60px] relative">
        <Banner />
        <HotMarkets />
        <Markets />
        <div className="flex items-center gap-[22px] h-[300px]">
          <div className="w-1/3 h-full">
            <TopWinners type="winners" />
          </div>
          <div className="w-1/3 h-full">
            <TopWinners type="sellers" />
          </div>
          <div className="w-1/3 h-full">
            <TopWinners type="losers" />
          </div>
        </div>
      </div>
    </>
  );
}
