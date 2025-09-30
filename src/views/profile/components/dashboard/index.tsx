import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import dayjs from "dayjs";
import StatisticsPlayer from "./statistics-player";
import StatisticsSeller from "./statistics-seller";
import Button from "@/components/button";
import SellerLevel from "@/components/seller-level";
import useCopy from "@/hooks/use-copy";
import CopyIcon from "@/components/icons/copy";
import Twitter from "@/components/icons/twitter";
import TG from "@/components/icons/tg";
import { useGlobalStore } from "@/stores/use-global";
import useReferralList from "@/hooks/airdrop/use-referral-list";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../popover-card";
import Badge from "../badge";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";

const Dashboard = (props: any) => {
  const { className, tab } = props;
  const globalStore = useGlobalStore();
  const { userInfo } = useAuth();
  const { referralData } = useReferralList();
  const { onCopy } = useCopy();

  return (
    <div
      className={clsx(
        "text-[14px] font-[400] leading-[100%] w-full p-[20px_20px_14px_13px] rounded-[20px] border border-[#E4E4E4] bg-white relative",
        "max-md:p-[12px_10px_17px]",
        className
      )}
    >
      <div className="absolute top-[-38px] left-[50%] translate-x-[-50%] flex flex-col items-center">
        <Avatar
          size={74}
          className="shrink-0 rounded-[8px] border-[2px] border-[#FFFFFFCC]"
          address={userInfo?.user}
          email={userInfo?.email}
        />
        <div className="flex justify-center items-center gap-[6px] mt-[8px]">
          <div className="flex items-center gap-[6px]">
            <div className="font-bold text-[#2B3337] text-[20px]">
              {userInfo?.name || userInfo?.show_email}
            </div>
            {tab === "seller" && (
              <div className="flex items-center gap-[7px]">
                <Popover
                  content={
                    <PopoverCard className="w-[140px]">
                      Player Engagement
                    </PopoverCard>
                  }
                  placement={PopoverPlacement.Top}
                  trigger={PopoverTrigger.Hover}
                  closeDelayDuration={0}
                >
                  <Badge icon="/profile/icon-user.svg">
                    {formatNumber(userInfo?.player_engagement, 0, true)}
                  </Badge>
                </Popover>
                <Popover
                  content={
                    <PopoverCard className="w-[140px]">
                      Cancellation Rate
                    </PopoverCard>
                  }
                  placement={PopoverPlacement.Top}
                  trigger={PopoverTrigger.Hover}
                  closeDelayDuration={0}
                >
                  <Badge icon="/profile/icon-cancel.svg">
                    {Big(userInfo?.created || 0).gt(0) &&
                    Big(userInfo?.cancel || 0).gt(0)
                      ? formatNumber(
                          Big(userInfo?.cancel)
                            .div(userInfo?.created)
                            .times(100),
                          2,
                          true
                        )
                      : 0}
                    %
                  </Badge>
                </Popover>
              </div>
            )}
          </div>
          {tab === "player" && <SellerLevel isSmall />}
        </div>
        <div className="flex items-center gap-[3px] mt-[8px]">
          <span className="text-[12px] text-[#2B3337]">
            {formatAddress(userInfo?.user)}
          </span>
          <button
            className="button"
            onClick={() => {
              onCopy(userInfo?.user);
            }}
          >
            <CopyIcon />
          </button>
        </div>
      </div>
      <div className="w-full pl-[13px] max-md:pl-0">
        <div className="w-full flex justify-between gap-[10px] max-md:relative">
          {/*#region User Info*/}
          <div className="flex gap-[14px]">
            <button className="w-[32px] h-[32px] border border-[#383F47]/30 rounded-[8px] button flex items-center justify-center">
              <Twitter />
            </button>
            <button className="w-[32px] h-[32px] border border-[#383F47]/30 rounded-[8px] button flex items-center justify-center">
              <TG />
            </button>
          </div>
          {/*#endregion*/}
          {/*#region Invite frenz*/}
          <div className="flex flex-col gap-[12px] items-end">
            <div className="flex justify-end gap-[13px] mt-[-10px] items-center">
              {Number(referralData?.total_num) > 0 && (
                <div className="flex items-center gap-[6px] h-[32px] bg-[#F2F2F299] border border-[#E4E4E4] rounded-[16px] pl-[5px] pr-[14px]">
                  <div className="flex items-center">
                    {referralData.list
                      ?.slice(0, 5)
                      .map((item: any, index: number) => (
                        <Avatar
                          key={index}
                          address={item.user}
                          email={item.user_email}
                          size={26}
                          className={clsx(
                            "rounded-full border-[2px] border-[#383F47] shrink-0",
                            index > 0 && "ml-[-8px]"
                          )}
                        />
                      ))}
                  </div>
                  <div className="[text-shaow:0px_1px_0px_#000]">
                    {Number(referralData?.total_num) || 0}
                  </div>
                </div>
              )}
              <Button
                className="border border-[#383F47]/30 h-[32px] w-[114px] !rounded-[8px]"
                onClick={() => {
                  onCopy(`${window.location.origin}?code=${globalStore.code}`);
                }}
              >
                + Invite frenz
              </Button>
            </div>
            <div className="text-[#5E6B7D] mt-[10px] font-[300] text-[12px] max-md:translate-y-[15px] max-md:absolute max-md:right-[0px] max-md:bottom-[20px]">
              Joined{" "}
              {userInfo?.created_at
                ? dayjs(userInfo.created_at).format("MMMM D, YYYY")
                : ""}
            </div>
          </div>
          {/*#endregion*/}
        </div>
      </div>
      {tab === "player" ? (
        <StatisticsPlayer
          onShare={() => {
            onCopy(`${window.location.origin}?code=${globalStore.code}`);
          }}
        />
      ) : (
        <StatisticsSeller />
      )}
    </div>
  );
};

export default Dashboard;
