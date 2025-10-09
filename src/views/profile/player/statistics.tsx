import Profit from "./profit";
import ProfitClaim from "../seller/profit-claim";
import YourWon from "./your-won";
// import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import dayjs from "dayjs";

export default function Statistics({ from }: { from: "player" | "seller" }) {
  const { userInfo } = useAuth();
  return (
    <div className="h-[128px] w-full bg-[#1A1E24] rounded-[6px] px-[20px] py-[16px] mt-[32px]">
      <div className="flex items-center justify-between text-[14px] text-[#5E6B7D]">
        <span>Statistics</span>
        <div className="flex items-center gap-[10px]">
          <span>
            Joined {dayjs(userInfo?.created_at).format("MMM DD, YYYY")}
          </span>
          {/* <Button
            className="w-[94px] h-[26px] text-[12px] border border-[#2F3843] !bg-[#1A1E24] !text-[#ADBCCF] ml-[6px]"
            isPrimary={false}
          >
            Last 30 days
          </Button> */}
        </div>
      </div>
      <div className="flex items-center mt-[20px]">
        <div className="w-1/3">
          <div className="text-[14px] text-white">Profit</div>
          <div className="flex items-center gap-[4px]">
            {from === "player" && (
              <Profit profit={userInfo?.player_profit || 0} />
            )}
            {from === "seller" && (
              <ProfitClaim profit={userInfo?.seller_profit || 0} />
            )}
          </div>
        </div>
        <div className="w-1/3">
          <div className="text-[14px] text-white">
            {from === "player" ? "Played" : "Sold / Created"}
          </div>
          <div className="flex items-center gap-[4px]">
            <span className="text-[20px] font-medium text-white">
              {from === "player"
                ? userInfo?.played_number
                : `${userInfo?.sold || 0} / ${userInfo?.created || 0}`}
            </span>
            <span className="text-[14px] text-[#5E6B7D] mt-[2px]">
              {from === "player" ? "times" : "items"}
            </span>
          </div>
        </div>
        {from === "player" ? (
          <div className="w-1/3">
            <div className="text-[14px] text-white">You Won</div>
            <YourWon data={userInfo?.you_won || []} />
          </div>
        ) : (
          <div className="w-1/3">
            <div className="text-[14px] text-white">On sell</div>
            <YourWon data={userInfo?.on_sell || []} />
          </div>
        )}
      </div>
    </div>
  );
}
