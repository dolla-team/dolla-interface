import clsx from "clsx";
import Button from "@/components/button";
import LabelValue from "../label-value";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";
import useUserWinner from "@/hooks/user/use-user-winner";
import useWalletStore from "@/stores/use-wallet";
import useBalance from "@/hooks/near/use-balance";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import { useNavigate } from "@/libs/router";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../popover-card";
import ReferralPanel from "./referral-panel";
import useUserWon from "@/hooks/user/use-user-won";

const StatisticsPlayer = (props: any) => {
  const { className } = props;

  return (
    <div
      className={clsx(
        "w-full mt-[16px] flex justify-center items-center gap-[18px] max-md:flex-col max-md:mt-[13px]",
        className
      )}
    >
      <RewardCard />
      <BalanceCard />
      <ReferralPanel />
    </div>
  );
};

export default StatisticsPlayer;

const RewardCard = () => {
  const { totalAmount, totalAmountWithPrice } = useUserWinner();
  const { userInfo } = useAuth();
  const { data: userWonData } = useUserWon();

  // Determine background image based on totalAmountWithPrice
  const backgroundImage = Big(totalAmountWithPrice || 0).gt(1000)
    ? "/profile/gold-bg.png"
    : "/profile/silver-bg.png";

  const WinsAmount = (
    <div
      className={clsx(
        "text-[16px] inline-block",
        userInfo?.winner > 0
          ? "border-b border-[#8A87AA] border-dotted pb-[4px] button"
          : ""
      )}
    >
      {formatNumber(userInfo?.winner, 2, true)}
    </div>
  );

  return (
    <div
      className={clsx(
        "w-[420px] h-[208px] px-[20px] py-[18px] border border-[#E4E4E4] rounded-[16px] shadow-[0px_0px_6px_rgba(0,_0,_0,_0.1)] bg-size-[105%_120%] bg-center bg-no-repeat"
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-[12px]">Total Reward Value</div>
      <div className="text-[32px] font-[700] mt-[24px]">
        ${formatNumber(totalAmountWithPrice || 0, 2, true)}
      </div>
      <div className="flex items-center gap-[40px] text-black mt-[22px]">
        <div className="flex items-center gap-[7px]">
          <img src={BASE_TOKEN.icon} className="w-[30px] h-[30px]" />
          <div className="text-[14px]">
            <span className="font-[700]">
              {formatNumber(totalAmount || 0, 6, true)}{" "}
            </span>
            <span className="font-[400]">{BASE_TOKEN.symbol}</span>
          </div>
        </div>
      </div>
      <div className="flex mt-[18px]">
        <LabelValue label="Your Bid" className="whitespace-nowrap w-1/3">
          <span className="text-[16px]">
            {formatNumber(userInfo?.player_total_bid, 2, true, {
              isShort: Big(userInfo?.player_total_bid || 0).gt(10000),
              isShortUppercase: true
            })}
          </span>
        </LabelValue>
        <LabelValue label="Wins" className="whitespace-nowrap w-1/3">
          {userWonData?.length === 0 ? (
            WinsAmount
          ) : (
            <YourWonInfo list={userWonData || []}>{WinsAmount}</YourWonInfo>
          )}
        </LabelValue>
        <LabelValue label="Top Multiplier" className="whitespace-nowrap w-1/3">
          <span className="text-[16px]">
            {formatNumber(userInfo?.highest_multiple, 2, true)}x
          </span>
        </LabelValue>
      </div>
    </div>
  );
};

const BalanceCard = () => {
  const { balance } = useBalance();
  const { nearAccount } = useAuth();
  const { address, login } = useAuth();
  const walletStore = useWalletStore();
  return (
    <div className="w-[420px] h-[208px] border border-[#E4E4E4] bg-white rounded-[16px] px-[20px] py-[18px] shadow-[0px_0px_6px_rgba(0,_0,_0,_0.1)]">
      <div className="text-[12px]">Balance</div>
      <div className="text-[32px] font-[700] mt-[24px]">
        ${formatNumber(balance || 0, 2, true)}
      </div>
      <div className="flex items-center gap-[40px] text-black mt-[22px]">
        <div className="flex items-center gap-[7px]">
          <img src={QUOTE_TOKEN.icon} className="w-[30px] h-[30px]" />

          <div className="text-[14px]">
            <span className="font-[700]">
              {formatNumber(nearAccount?.balance || 0, 2, true)}{" "}
            </span>
            <span className="font-[400]">{QUOTE_TOKEN.symbol}</span>
          </div>
        </div>
        <div className="flex items-center gap-[7px]">
          <img src={BASE_TOKEN.icon} className="w-[30px] h-[30px]" />

          <div className="text-[14px]">
            <span className="font-[700]">
              {formatNumber(nearAccount?.prizeBalance || 0, 6, true)}{" "}
            </span>
            <span className="font-[400]">{BASE_TOKEN.symbol}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[24px] mt-[14px] max-md:w-full max-md:justify-between max-md:gap-[10px]">
        <Button
          className="border border-[#383F47]/30 text-[#2B3337] w-[240px] h-[48px] !rounded-[12px]"
          onClick={(ev) => {
            if (!address) {
              login();
              return;
            }
            ev.stopPropagation();
            walletStore.set({
              showWallet: true,
              panelType: "deposit"
            });
          }}
        >
          Deposit
        </Button>
        <Button
          className="border border-[#383F47]/30 text-[#2B3337] w-[240px] h-[48px] !rounded-[12px]"
          onClick={(ev) => {
            if (!address) {
              login();
              return;
            }
            ev.stopPropagation();

            walletStore.set({
              showWallet: true,
              panelType: "withdraw"
            });
          }}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

const YourWonInfo = ({
  children,
  list
}: {
  children: React.ReactNode;
  list: any[];
}) => {
  const navigate = useNavigate();
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <PopoverCard className="w-[265px] text-[12px] p-[10px] flex flex-col gap-[10px]">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate(`/btc/${item.pool_id}`);
              }}
              className="button text-[#2B3337] text-[12px] w-full h-[36px] bg-[#F2F2F299] hover:bg-[#FFC42F] rounded-[8px] flex items-center justify-between px-[10px]"
            >
              <div className="font-[400]">
                {" "}
                <span>#{item.pool_id}</span>
                <span className="ml-[20px]">
                  {Big(item.claim_reward_amount || 0)
                    .div(10 ** BASE_TOKEN.decimals)
                    .toString()}{" "}
                  {BASE_TOKEN.symbol}
                </span>
              </div>
              <span className="font-[600]">
                {formatNumber(item.profit_ratio, 0, true)}x
              </span>
            </div>
          ))}
        </PopoverCard>
      }
    >
      {children}
    </Popover>
  );
};
