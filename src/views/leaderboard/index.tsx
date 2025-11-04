import PageBack from "@/views/profile/components/page-back";
import Top from "./top";
import TopWinners from "@/views/btc-list/top-winners";

export default function Leaderboard() {
  return (
    <div className="relative">
      <PageBack className="!border-[#555555] !bg-[#FFFFFF33] !text-[#fff] !top-[20px]" />
      <div className="w-full relative z-[2] pt-[20px] pb-[60px] max-md:pt-[80px]">
        <div
          className="text-center text-[36px] font-[700]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #FFD876 0%, #FFB700 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Leaderboard
        </div>
        <Top />
        <div className="flex justify-center gap-[22px] mt-[30px]">
          <div className="w-[372px]">
            <TopWinners type="winners" />
          </div>
          <div className="w-[372px]">
            <TopWinners type="sellers" />
          </div>
          <div className="w-[372px]">
            <TopWinners type="losers" />
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[285px] bg-[url('/leaderboard/bg.jpg')] bg-cover bg-top bg-no-repeat z-0 pointer-events-none" />
    </div>
  );
}
