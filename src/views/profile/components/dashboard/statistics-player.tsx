import clsx from "clsx";
import Button from "@/components/button";
import LabelValue from "../label-value";
import { useState } from "react";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";
import Loading from "@/components/icons/loading";
import useUserWinner from "@/hooks/use-user-winner";
import ClaimModal from "../claim/modal";
import useWalletStore from "@/stores/use-wallet";

const StatisticsPlayer = (props: any) => {
  const { className } = props;
  const walletStore = useWalletStore();
  const { userInfo, nearAccount } = useAuth();

  const { totalAmount, loading } = useUserWinner();

  const [claimModalOpen, setClaimModalOpen] = useState(false);

  // const [claimableAmount] = useMemo(() => {
  //   if (!userInfo) {
  //     return [Big(0), Big(0)];
  //   }
  //   return [
  //     userInfo.you_won?.reduce(
  //       (acc: any, item: any) => Big(acc).plus(item.token_usd),
  //       Big(0)
  //     ),
  //     userInfo.claim_winner_pool
  //       ?.filter?.((item: any) => !item.is_claim)
  //       ?.reduce(
  //         (acc: any, item: any) => Big(acc).plus(item.accumulative_bids),
  //         Big(0)
  //       )
  //   ];
  // }, [userInfo]);

  return (
    <div
      className={clsx(
        "w-full mt-[10px] flex items-center gap-[18px] max-md:flex-col max-md:mt-[13px]",
        className
      )}
    >
      <div className="flex shrink-0 flex-col justify-center items-center gap-[15px] p-[20px_32px_33px] bg-black text-white rounded-[16px] shrink-0">
        <div className="text-[12px]">Wins</div>
        <div className="font-[DelaGothicOne] text-[36px]">
          {formatNumber(userInfo?.winner, 2, true)}
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-[#E4E4E4] h-[1px]" />
        <div className="flex items-center">
          <div className="flex items-center w-[36%]">
            <LabelValue label="Total Valued" className="">
              {loading ? (
                <Loading size={12} />
              ) : (
                formatNumber(totalAmount, 3, true, {
                  prefix: "$"
                })
              )}
            </LabelValue>
            <Button
              className="border border-[#383F47]/30 text-[#2B3337] w-[96px] h-[38px] !rounded-[8px] ml-[20px]"
              // disabled={Big(claimableAmount || 0).lte(0)}
              onClick={() => {
                // setClaimModalOpen(true);
              }}
            >
              Share
            </Button>
          </div>
          <div className="w-[1px] h-[70px] shrink-0 bg-[#E4E4E4] mt-[10px] max-md:hidden"></div>
          <div className="flex items-center justify-between gap-[10px] flex-1 pl-[30px] max-md:flex-col max-md:w-full max-md:gap-[15px]">
            <div className="flex items-center gap-[10px] max-md:w-full max-md:justify-between max-md:pr-[30px] max-md:pl-[7px]">
              <LabelValue label="Your Balance" className="whitespace-nowrap">
                {formatNumber(nearAccount?.balance || 0, 2, true, {
                  prefix: "$",
                  isShort: true,
                  isShortUppercase: true
                })}
              </LabelValue>
              <LabelValue label="Played times" className="whitespace-nowrap">
                {formatNumber(userInfo?.played, 2, true, {
                  isShort: Big(userInfo?.played || 0).gt(10000),
                  isShortUppercase: true
                })}
              </LabelValue>
            </div>
            <div className="flex items-center justify-end gap-[8px] max-md:w-full max-md:justify-between max-md:gap-[10px]">
              <Button
                className="!bg-black text-white w-[96px] h-[38px] !rounded-[8px]"
                onClick={(ev) => {
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
                className="border border-[#383F47]/30 text-[#2B3337] w-[96px] h-[38px] !rounded-[8px]"
                onClick={(ev) => {
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
        </div>
      </div>

      <ClaimModal
        type="player"
        open={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
        }}
      />
    </div>
  );
};

export default StatisticsPlayer;
