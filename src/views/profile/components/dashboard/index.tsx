import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import dayjs from "dayjs";
import StatisticsPlayer from "./statistics-player";
import StatisticsSeller from "./statistics-seller";
import Button from "@/components/button";
import SellerLevel from "@/components/seller-level";
import useCopy from "@/hooks/use-copy";
import CopyIcon from "@/components/icons/copy";
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
import useUserInfoStore from "@/stores/use-user-info";

const Dashboard = (props: any) => {
  const { className, tab, pnlList, pnl } = props;
  const globalStore = useGlobalStore();
  const { userInfo, address, login } = useAuth();
  const { referralData } = useReferralList();
  const { onCopy } = useCopy();
  const userInfoStore = useUserInfoStore();
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
          className="shrink-0 rounded-[8px] border-[2px] border-[#FFFFFFCC] text-[26px]"
          src={userInfo?.icon}
          email={userInfo?.show_email}
          address={userInfo?.user}
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
                      Bidder Engagement
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
          {tab === "seller" && <SellerLevel />}
        </div>
        <div className="flex items-center gap-[14px] mt-[8px]">
          <div className="flex items-center gap-[3px]">
            <span className="text-[12px] text-[#2B3337]">
              {userInfo?.show_email}
            </span>
            <button
              className="button"
              onClick={() => {
                onCopy(userInfo?.show_email);
              }}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full pl-[13px] max-md:pl-0">
        <div className="w-full flex justify-between gap-[10px] max-md:relative">
          {/*#region User Info*/}
          <button
            onClick={() => {
              if (!address) {
                login();
                return;
              }
              userInfoStore.set({ showSetting: true });
            }}
            className="w-[92px] h-[32px] border border-[#383F47]/30 rounded-[8px] button flex gap-[6px] items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
            >
              <path
                d="M7.46713 4.34437C5.9737 4.34437 4.75166 5.54639 4.75166 7.01809C4.75166 8.48814 5.9737 9.6918 7.46713 9.6918C8.96056 9.6918 10.1826 8.48978 10.1826 7.01809C10.1826 5.54639 8.96056 4.34437 7.46713 4.34437ZM5.29442 0C5.56579 0 5.87088 0.100305 6.04113 0.268029C6.24508 0.501527 6.95809 1.10336 7.50084 1.10336C8.0436 1.10336 8.7566 0.501527 8.96056 0.300916C9.1308 0.100305 9.43589 0 9.70727 0C9.87751 0 9.97865 -2.35226e-08 10.1152 0.0674183H10.1489L12.0148 1.10336H12.0485C12.4211 1.37139 12.5576 1.87127 12.3873 2.27249C12.3873 2.27249 12.2171 2.64083 12.2171 2.97463C12.2171 3.97768 13.0312 4.77848 14.0493 4.77848H14.1168C14.4556 4.77848 14.7269 5.0794 14.8298 5.54639C14.8635 5.57928 15 6.38172 15 7.01644C15 7.68405 14.8298 8.48649 14.8298 8.48649C14.7623 8.95349 14.4572 9.2544 14.1168 9.2544H14.0493C13.0312 9.2544 12.2171 10.0568 12.2171 11.0583C12.2171 11.3921 12.3873 11.7604 12.3873 11.7604C12.5576 12.1616 12.4211 12.6286 12.0485 12.8966H12.0148L10.1489 13.9326H10.1152C10.014 13.9655 9.87751 14 9.74267 14C9.43758 14 9.13249 13.8668 8.96224 13.6662C8.75829 13.4327 8.01157 12.798 7.46882 12.798C6.95977 12.798 6.28048 13.3998 6.0091 13.6662C5.83886 13.8668 5.56748 14 5.26239 14C5.09215 14 4.99101 14 4.85448 13.9326H4.82077L2.98854 12.9295H2.95483C2.57894 12.6631 2.44409 12.1616 2.61265 11.762C2.61265 11.762 2.7829 11.3937 2.7829 11.0599C2.7829 10.0568 1.96876 9.25605 0.950669 9.25605H0.883245C0.544443 9.25605 0.273064 8.95513 0.170244 8.48814C0.136532 8.45525 0 7.65281 0 7.01809C0 6.41625 0.136532 5.61546 0.170244 5.54804C0.237667 5.08104 0.542758 4.78013 0.883245 4.78013H0.916957C1.93505 4.78013 2.74919 3.97768 2.74919 2.97627C2.74919 2.64247 2.57894 2.27414 2.57894 2.27414C2.4087 1.87292 2.54523 1.40592 2.91774 1.13789H2.95146L4.8865 0.0690627H4.92022C5.02304 0.032887 5.15957 0 5.29442 0Z"
                fill="#C3C5C8"
              />
            </svg>
            <span className="text-[12px] text-[#2B3337]">Setting</span>
          </button>
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
                          src={item.user_icon}
                          email={item.user_email}
                          address={item.user}
                          size={26}
                          className={clsx(
                            "rounded-full border-[2px] border-[#383F47] shrink-0 text-[12px]",
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
                  if (!address) {
                    login();
                    return;
                  }
                  if (globalStore.code) {
                    onCopy(
                      `${window.location.origin}?code=${globalStore.code}`
                    );
                  }
                }}
                disabled={!globalStore.code}
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
        <StatisticsSeller pnlList={pnlList} pnl={pnl} />
      )}
    </div>
  );
};

export default Dashboard;
