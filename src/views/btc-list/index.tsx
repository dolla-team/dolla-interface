import HotMarkets from "./hot-markets";
import Banner from "./banner";
import LucyDraw from "@/sections/lucy-draw";
import TopWinners from "./top-winners";
import Leaderboard from "./leaderboard";
import Markets from "./markets";
import { useAuth } from "@/contexts/auth";

export default function Home() {
  const { quoteTokenBalance } = useAuth();
  return (
    <div className="pb-[30px]">
      <div className="w-[1158px] mx-auto pt-[30px]">
        <Banner />
        <HotMarkets />
        <Markets />
        <div className="flex items-center gap-[22px] h-[154px] mt-[30px]">
          <div className="w-1/3">
            <LucyDraw tokenBalance={quoteTokenBalance} />
          </div>
          <div className="w-1/3 h-full">
            <TopWinners />
          </div>
          <div className="w-1/3 h-full">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
