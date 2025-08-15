import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import useToast from "@/hooks/use-toast";
import { useState } from "react";
import dayjs from "dayjs";
import StatisticsPlayer from "./statistics-player";
import StatisticsSeller from "./statistics-seller";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Badge from "../badge";
import ButtonV2 from "@/components/button/v2";
import PopoverCard from "../popover-card";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import useIsMobile from "@/hooks/use-is-mobile";

const Dashboard = (props: any) => {
  const { className, tab } = props;

  const { userInfo } = useAuth();
  const toast = useToast();
  const isMobile = useIsMobile();

  const [inviteFrenz] = useState([]);

  return (
    <div
      className={clsx(
        "font-[SpaceGrotesk] text-white text-[14px] font-[400] leading-[100%] w-full p-[23px_29px_15px_13px] rounded-[16px] border border-[#383F47] bg-[radial-gradient(81.26%_82.97%_at_1.18%_2.95%,_rgba(111,_55,_255,_0.20)_0%,_rgba(0,_0,_0,_0.20)_100%)] bg-[#1A1E24]",
        "max-md:p-[12px_10px_17px]",
        className
      )}
    >
      <div className="w-full pl-[13px] max-md:pl-0">
        <div className="w-full flex justify-between items-center gap-[10px] max-md:relative">
          {/*#region User Info*/}
          <div className="flex items-center gap-[20px] max-md:gap-[10px]">
            <Avatar
              size={60}
              className="shrink-0 rounded-[8px] border-[2px] border-[#383F47]"
              address={userInfo?.user}
              email={userInfo?.email}
            />
            <div className="flex flex-col gap-[14px]">
              <div className="relative font-[DelaGothicOne] text-[20px] flex items-center gap-[9px]">
                <div className="">
                  {formatAddress(userInfo?.name || userInfo?.user, 3)}
                </div>
                {tab === "seller" && (
                  <div className="flex items-center gap-[7px]">
                    <Popover
                      content={<PopoverCard>Player Engagement</PopoverCard>}
                      placement={PopoverPlacement.Top}
                      trigger={PopoverTrigger.Hover}
                      closeDelayDuration={0}
                    >
                      <Badge icon="/profile/icon-user.svg">
                        {formatNumber(userInfo?.player_engagement, 0, true)}
                      </Badge>
                    </Popover>
                    <Popover
                      content={<PopoverCard>Cancellation Rate</PopoverCard>}
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
              <div className="flex items-center gap-[5px]">
                <div className="text-[#ADBCCF]">
                  {formatAddress(userInfo?.user)}
                </div>
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(userInfo?.user || "");
                      toast.success({ title: "Copied to clipboard" });
                    } catch (error) {
                      toast.fail({ title: "Failed to copy" });
                    }
                  }}
                >
                  <img
                    src="/profile/icon-copy.svg"
                    alt="copy"
                    className="w-full h-full object-center object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
          {/*#endregion*/}
          {/*#region Invite frenz*/}
          <div className="flex flex-col gap-[12px] items-end">
            {!isMobile && (
              <div className="flex justify-end gap-[13px] items-center">
                {inviteFrenz.length > 0 && (
                  <div className="flex items-center gap-[6px] h-[32px] bg-black/20 border border-[#383F47] rounded-[16px] pl-[5px] pr-[14px]">
                    <div className="flex items-center">
                      {inviteFrenz
                        .slice(0, 5)
                        .map((item: any, index: number) => (
                          <img
                            key={index}
                            src={item.avatar}
                            alt=""
                            className={clsx(
                              "w-[26px] h-[26px] rounded-full border-[2px] border-[#383F47] shrink-0",
                              index > 0 && "ml-[-8px]"
                            )}
                          />
                        ))}
                    </div>
                    <div className="[text-shaow:0px_1px_0px_#000]">
                      {inviteFrenz.length || 0}
                    </div>
                  </div>
                )}
                <ButtonV2 soon disabled onClick={() => {}}>
                  Invite frenz
                </ButtonV2>
              </div>
            )}
            <div className="max-md:text-[12px] max-md:translate-y-[15px] max-md:absolute max-md:right-[0px] max-md:bottom-[20px]">
              Joined{" "}
              {userInfo?.created_at
                ? dayjs(userInfo.created_at).format("MMMM D, YYYY")
                : ""}
            </div>
          </div>
          {/*#endregion*/}
        </div>
        <div className="w-full bg-[#383F47] h-[1px] mt-[20px] max-md:mt-[14px]" />
      </div>
      {tab === "player" ? <StatisticsPlayer /> : <StatisticsSeller />}
    </div>
  );
};

export default Dashboard;
