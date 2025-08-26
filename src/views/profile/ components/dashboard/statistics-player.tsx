import clsx from "clsx";
import ButtonV2 from "@/components/button/v2";
import LabelValue from "../label-value";
import { useMemo, useState } from "react";
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
  const { userInfo, quoteTokenBalance } = useAuth();

  const { totalBtcAmount, loading: totalBtcLoading } = useUserWinner();

  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const [claimableAmount] = useMemo(() => {
    if (!userInfo) {
      return [Big(0), Big(0)];
    }
    return [
      userInfo.you_won?.reduce(
        (acc: any, item: any) => Big(acc).plus(item.token_usd),
        Big(0)
      ),
      userInfo.claim_winner_pool
        ?.filter?.((item: any) => !item.is_claim)
        ?.reduce(
          (acc: any, item: any) => Big(acc).plus(item.accumulative_bids),
          Big(0)
        )
    ];
  }, [userInfo]);

  return (
    <div
      className={clsx(
        "w-full mt-[20px] flex items-center justify-between gap-[30px] max-md:flex-col max-md:mt-[13px]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-[10px] flex-1 max-md:justify-between max-md:w-full max-md:pl-[4px] max-md:pr-[10px]">
        <div className="flex flex-col justify-center items-center gap-[15px] p-[20px_32px_33px] bg-[#743EFF] rounded-[16px] shrink-0">
          <div className="">Wins</div>
          <div className="font-[DelaGothicOne] text-[36px]">
            {formatNumber(userInfo?.winner, 2, true)}
          </div>
        </div>
        <LabelValue label="Total Valued" className="">
          {totalBtcLoading ? (
            <Loading size={12} />
          ) : (
            formatNumber(totalBtcAmount, 3, true, {
              prefix: "$"
            })
          )}
        </LabelValue>
        {/* <ButtonV2 className="" onClick={() => { }} disabled soon>
          Share
        </ButtonV2> */}
        <ButtonV2
          className="max-md:flex-1 !text-[14px]"
          // disabled={Big(claimableAmount || 0).lte(0)}
          onClick={() => {
            setClaimModalOpen(true);
          }}
        >
          Claim
        </ButtonV2>
      </div>
      <div className="w-[1px] h-[70px] shrink-0 bg-[#423930] max-md:hidden"></div>
      <div className="flex items-center justify-between gap-[10px] flex-1 max-md:flex-col max-md:w-full max-md:gap-[15px]">
        <div className="flex items-center gap-[10px] max-md:w-full max-md:justify-between max-md:pr-[30px] max-md:pl-[7px]">
          <LabelValue label="Your Balance" className="whitespace-nowrap">
            {formatNumber(quoteTokenBalance, 2, true, {
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
          <ButtonV2
            className="max-md:flex-1 !text-[14px]"
            onClick={() => {
              walletStore.set({
                showWallet: true,
                panelType: "deposit"
              });
            }}
          >
            Deposit
          </ButtonV2>
          <ButtonV2
            className="max-md:flex-1 !text-[14px]"
            type="default"
            onClick={() => {
              walletStore.set({
                showWallet: true,
                panelType: "withdraw"
              });
            }}
          >
            Withdraw
          </ButtonV2>
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
