import HotMarkets from "./hot-markets";
import Banner from "./banner";
import LucyDraw from "@/sections/lucy-draw";
import TopWinners from "./top-winners";
import Markets from "./markets";
import { useAuth } from "@/contexts/auth";

export default function Home() {
  const { nearAccount } = useAuth();
  return (
    <div className="w-[1158px] mx-auto pt-[30px] pb-[60px]">
      <Banner />
      <HotMarkets />
      <Markets />
      <div className="flex items-center gap-[22px] h-[200px] mt-[30px]">
        <div className="w-1/3 h-full">
          <LucyDraw tokenBalance={nearAccount?.balance} />
        </div>
        <div className="w-1/3 h-full">
          <TopWinners type="winners" />
        </div>
        <div className="w-1/3 h-full">
          <TopWinners type="sellers" />
        </div>
      </div>
    </div>
  );
}
