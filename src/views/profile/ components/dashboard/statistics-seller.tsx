import clsx from "clsx";
import LabelValue from "../label-value";
import ButtonV2 from "@/components/button/v2";
import Badge from "../badge";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimModal from "../claim/modal";

const StatisticsPlayer = (props: any) => {
  const { className } = props;

  const { onQueryUserInfo, userInfo } = useAuth();
  const navigate = useNavigate();

  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const [onSellTotalAmount, claimableValue] = useMemo(() => {
    const _result: any = [Big(0), Big(0)];
    if (!userInfo) {
      return _result;
    }
    if (userInfo.on_sell) {
      _result[0] = userInfo
        .on_sell
        .filter((item: any) => item.reward_token_info?.symbol === "BTC")
        .reduce((acc: any, item: any) => Big(acc).plus(Big(item.reward_amount || 0).div(10 ** (item.reward_token_info?.decimals || 6))), 0);
    }
    if (userInfo.claim_pool) {
      _result[1] = userInfo
        .claim_pool
        .filter((item: any) => !item.is_claim)
        .reduce((acc: any, item: any) => Big(acc).plus(Big(item.accumulative_bids || 0)), 0);
    }
    return _result;
  }, [userInfo]);

  return (
    <div
      className={clsx(
        "flex justify-between items-center gap-[40px] pl-[13px] mt-[40px] pb-[16px] max-md:mt-[13px] max-md:flex-col max-md:gap-[20px] max-md:pl-0 max-md:pb-0",
        className
      )}
    >
      <div className="flex items-center gap-[10px] flex-1 justify-between max-md:w-full">
        <LabelValue label="PnL" className="" valueClassName={clsx(Big(userInfo?.seller_profit || 0).lt(0) ? "text-[#FF399F]" : "text-[#57FF70]")}>
          {Big(userInfo?.seller_profit || 0).lt(0) ? "-" : "+"}{formatNumber(Big(userInfo?.seller_profit || 0).abs(), 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}
        </LabelValue>
        <LabelValue label="Claimable" className="" valueClassName="flex items-center gap-[13px]">
          <div className="">
            {formatNumber(claimableValue, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}
          </div>
          <ButtonV2
            className=""
            disabled={Big(claimableValue || 0).lte(0)}
            onClick={() => {
              setClaimModalOpen(true);
            }}
          >
            Claim
          </ButtonV2>
        </LabelValue>
      </div>
      <div className="flex items-center gap-[10px] flex-2 justify-between max-md:flex-col max-md:w-full">
        <LabelValue label="Created Market" className="max-md:w-full" valueClassName="flex items-center gap-[13px]">
          <div className="">
            {formatNumber(userInfo?.created, 0, true, { isShort: true, isShortUppercase: true })}
          </div>
          <div className="flex items-center gap-[8px] whitespace-nowrap flex-wrap">
            <Badge
              className="h-[24px] !px-[10px] !text-[14px]"
              icon={(<div className="w-[7px] h-[7px] shrink-0 rounded-full bg-[#57FF70]" />)}
            >
              {formatNumber(Big(userInfo?.created || 0).minus(userInfo?.cancel || 0).minus(userInfo?.ended || 0), 0, true, { isShort: true, isShortUppercase: true })} Live
            </Badge>
            <Badge
              className="h-[24px] !px-[10px] !text-[14px]"
              icon={(<div className="w-[7px] h-[7px] shrink-0 rounded-full bg-[#FF399F]" />)}
            >
              {formatNumber(userInfo?.cancel, 0, true, { isShort: true, isShortUppercase: true })} Cancelled
            </Badge>
            <Badge
              className="h-[24px] !px-[10px] !text-[14px]"
              icon={(<div className="w-[7px] h-[7px] shrink-0 rounded-full bg-[#FF9F39]" />)}
            >
              {formatNumber(userInfo?.ended, 0, true, { isShort: true, isShortUppercase: true })} Ended
            </Badge>
          </div>
        </LabelValue>
        <LabelValue label="On Sell" className="max-md:w-full max-md:mt-[10px] max-md:gap-[8px]" valueClassName="flex items-center gap-[13px]">
          <div className="">
            {formatNumber(onSellTotalAmount, 3, true, { isShort: true, isShortUppercase: true })} BTC
          </div>
          <ButtonV2
            onClick={() => {
              navigate(`/btc/create`);
            }}
            type="default"
          >
            Create
          </ButtonV2>
        </LabelValue>
      </div>
      <ClaimModal
        type="seller"
        open={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
        }}
      />
    </div>
  );
};

export default StatisticsPlayer;
