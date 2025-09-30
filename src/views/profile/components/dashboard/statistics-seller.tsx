import clsx from "clsx";
import LabelValue from "../label-value";
import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProfitFee } from "@/utils/pool";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../popover-card";
import { BASE_TOKEN } from "@/config/btc";

const StatisticsPlayer = (props: any) => {
  const { className } = props;

  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [onSellTotalAmount, claimableValue] = useMemo(() => {
    const _result: any = [Big(0), Big(0)];
    if (!userInfo) {
      return _result;
    }

    if (userInfo.on_sell) {
      _result[0] = userInfo.on_sell
        .filter(
          (item: any) =>
            item.reward_token_info?.[0]?.symbol === BASE_TOKEN.symbol
        )
        .reduce(
          (acc: any, item: any) =>
            Big(acc).plus(
              Big(item.reward_amount || 0).div(
                10 ** (item.reward_token_info?.[0]?.decimals || 6)
              )
            ),
          0
        );
    }
    if (userInfo.claim_pool) {
      _result[1] = userInfo.claim_pool.reduce(
        (acc: any, item: any) =>
          Big(acc).plus(
            Big(item.accumulative_bids || 0).minus(
              getProfitFee(item, { isLog: false })
            )
          ),
        0
      );
    }
    return _result;
  }, [userInfo]);

  return (
    <div
      className={clsx(
        "flex items-center gap-[18px] pl-[13px] mt-[10px] max-md:mt-[13px] max-md:flex-col max-md:gap-[20px] max-md:pl-0 max-md:pb-0",
        className
      )}
    >
      <div className="flex flex-col justify-center items-center gap-[15px] p-[20px_32px_33px] bg-black text-white rounded-[16px] shrink-0">
        <div className="text-[12px]">Sold</div>
        <div className="font-[DelaGothicOne] text-[36px]">{userInfo?.sold}</div>
      </div>
      <div className="flex-1">
        <div className="bg-[#E4E4E4] h-[1px]" />
        <div className="flex items-center">
          <div className="flex items-center gap-[32px] max-md:w-full w-[36%]">
            <LabelValue
              label="PnL"
              className=""
              valueClassName={clsx(
                Big(userInfo?.seller_profit || 0).lt(0)
                  ? "text-[#FF399F]"
                  : "text-[#57FF70]"
              )}
            >
              {Big(userInfo?.seller_profit || 0).lt(0) ? "-" : "+"}
              {formatNumber(Big(userInfo?.seller_profit || 0).abs(), 2, true, {
                prefix: "$",
                isShort: true,
                isShortUppercase: true
              })}
            </LabelValue>
            {/* <LabelValue
          label="Claimable"
          className=""
          valueClassName="flex items-center gap-[13px]"
        >
          <div className="">
            {formatNumber(claimableValue, 2, true, {
              prefix: "$",
              isShort: true,
              isShortUppercase: true,
              round: Big.roundDown
            })}
          </div>
        </LabelValue> */}
          </div>
          <div className="w-[1px] h-[70px] mt-[10px] shrink-0 bg-[#E4E4E4] max-md:hidden"></div>
          <div className="flex items-center pl-[30px] gap-[50px] flex-2 max-md:flex-col max-md:w-full">
            <LabelValue
              label="Created Market"
              className="max-md:w-full"
              valueClassName="flex items-center gap-[13px]"
            >
              <Popover
                content={
                  <PopoverCard className="w-[140px] py-[14px]">
                    <div className="inline-flex gap-[4px] h-[24px] px-[10px] items-center border border-[#E4E4E4] rounded-[16px] bg-[#F2F2F299]">
                      <div className="w-[7px] h-[7px] shrink-0 rounded-full bg-[#57FF70]" />
                      <div className="text-[10px] text-[#2B3337]">
                        {Big(userInfo?.created || 0)
                          .minus(userInfo?.cancel || 0)
                          .minus(userInfo?.ended || 0)
                          .toFixed(0)}{" "}
                        Live
                      </div>
                    </div>
                    <div className="inline-flex gap-[4px] mt-[10px] h-[24px] px-[10px] items-center border border-[#E4E4E4] rounded-[16px] bg-[#F2F2F299]">
                      <div className="w-[7px] h-[7px] shrink-0 rounded-full bg-[#FF399F]" />
                      <div className="text-[10px] text-[#2B3337]">
                        {userInfo?.cancel} Cancelled
                      </div>
                    </div>
                    <div className="inline-flex gap-[4px] mt-[10px] h-[24px] px-[10px] items-center border border-[#E4E4E4] rounded-[16px] bg-[#F2F2F299]">
                      <div className="w-[7px] h-[7px] shrink-0 rounded-full bg-[#C9C9C9]" />
                      <div className="text-[10px] text-[#2B3337]">
                        {userInfo?.ended} Ended
                      </div>
                    </div>
                  </PopoverCard>
                }
                placement={PopoverPlacement.Top}
                trigger={PopoverTrigger.Hover}
                closeDelayDuration={0}
              >
                <div className="button hover:underline">
                  {formatNumber(userInfo?.created, 0, true, {
                    isShort: true,
                    isShortUppercase: true
                  })}
                </div>
              </Popover>
            </LabelValue>
            <LabelValue
              label="On Sell"
              className="max-md:w-full max-md:mt-[10px] max-md:gap-[8px]"
              valueClassName="flex items-center gap-[13px]"
            >
              <div className="text-[16px] font-[DelaGothicOne]">
                {formatNumber(onSellTotalAmount, 3, true, {
                  isShort: true,
                  isShortUppercase: true
                })}{" "}
              </div>
            </LabelValue>
            <Button
              onClick={() => {
                navigate(`/btc/create`);
              }}
              className="!bg-black text-white w-[96px] h-[38px] !rounded-[8px]"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPlayer;
