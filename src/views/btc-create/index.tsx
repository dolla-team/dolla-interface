import clsx from "clsx";
import { useMemo, useState } from "react";

import Recharge from "@/sections/cashier/panels/recharge";
import PriceChart from "../nft-create/price-chart";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN } from "@/config/btc";
import useTokenBalance from "@/hooks/solana/use-token-balance";
import { formatNumber } from "@/utils/format/number";
import useTokenPrice from "@/hooks/use-token-price";
import Loading from "@/components/icons/loading";
import useCreate from "@/hooks/solana/use-create";
import { motion } from "framer-motion";
import ButtonV2 from "@/components/button/v2";
import DoughnutChart from "./doughnut-chart";
import { formatAddress } from "@/utils/format/address";
import { useReferenceData } from "./hooks/use-reference-data";
import Skeleton from "@/components/skeleton";
import { useConfigStore } from "@/stores/use-config";
import Big from "big.js";

export default function BTCCreate() {
  const [amount, setAmount] = useState(1);
  const { address } = useAuth();
  const { tokenBalance, isLoading, update } = useTokenBalance(BASE_TOKEN);
  const { data: referenceData, loading: referenceDataLoading } =
    useReferenceData({ token: BASE_TOKEN, amount });
  const globalConfig = useConfigStore((state) => state.config);

  const { prices } = useTokenPrice(BASE_TOKEN);

  const pricePerBTC = useMemo(() => {
    if (!prices || prices?.length === 0) return 0;
    const _p = prices[0].last_price;
    return _p;
  }, [prices]);

  const { onCreate, creating } = useCreate({
    amount,
    anchorPrice: pricePerBTC,
    onCreateSuccess: () => {
      update();
    }
  });

  const errorTips = useMemo(() => {
    if (Number(tokenBalance) < amount) {
      return "Insufficient balance";
    }
    if (pricePerBTC === 0) {
      return "Anchor price not found";
    }
    return "";
  }, [amount, tokenBalance, pricePerBTC]);

  const [poolCashOutTiming, poolBidsOvermarket] = useMemo(() => {
    return [
      globalConfig?.pool_cash_out_timing?.map((_item: any) => ({
        label: _item.days,
        value: _item.volume,
        percentage: _item.percentage[0]
      })) || [],
      globalConfig?.pool_bids_overmarket?.map((_item: any) => ({
        label: Big(_item.volume || 0)
          .div(10 ** BASE_TOKEN.decimals)
          .toNumber(),
        value: _item.bid,
        percentage: _item.percentage[0]
      })) || []
    ];
  }, [globalConfig]);

  return (
    <div className="w-full h-screen overflow-y-auto font-[SpaceGrotesk] text-[14px] font-[400] leading-[100%] text-white pt-[60px] pb-[60px]">
      <div className="text-[20px] font-[DelaGothicOne] text-center">
        Create BTC Market
      </div>
      <div className="w-[894px] mx-auto flex justify-between items-start gap-[15px] pt-[42px]">
        <div className="flex-1 w-0">
          <div className="w-full">
            <div className="text-[#BBACA6]">Amount</div>
            <div className="mt-[13px] flex items-center gap-[10px] h-[97px]">
              {[1, 0.1, 0.01, 0.001].map((item, index) => {
                const isActive = amount === item;
                return (
                  <motion.div
                    key={index}
                    className={clsx(
                      "button rounded-[10px] bg-[#2B2C2F] flex flex-col items-center justify-center gap-[9px] border",
                      isActive ? "backdrop-blur-[10px]" : ""
                    )}
                    onClick={() => setAmount(item)}
                    initial={{ width: "25%" }}
                    animate={{
                      width: isActive
                        ? "calc(25% + 34px)"
                        : "calc(25% - 11.33px)",
                      height: isActive ? 97 : 78,
                      borderColor: isActive ? "#FFE9B2" : "transparent",
                      backgroundColor: isActive
                        ? "rgba(255, 255, 255, 0.1)"
                        : "#2B2C2F"
                    }}
                    style={{
                      fontSize: isActive ? 20 : 16
                    }}
                  >
                    <div className="font-[DelaGothicOne]">{item} BTC</div>
                    <div className="text-[#BBACA6] text-[14px]">
                      ~${formatNumber(item * pricePerBTC, 0, true)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <ButtonV2
              disabled={!!errorTips}
              className="mt-[20px] w-full h-[40px]"
              loading={creating}
              onClick={() => {
                if (errorTips) return;
                onCreate();
              }}
            >
              {errorTips || "Create Market"}
            </ButtonV2>
          </div>
          <div className="mt-[36px] w-full">
            <div className="text-[#BBACA6]">Reference Data</div>
            <div className="w-full grid grid-cols-3 gap-[10px] mt-[11px]">
              <div className="rounded-[10px] border border-[#2B2C2F] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                <div className="flex justify-center items-center gap-[7px]">
                  <div className="font-[DelaGothicOne]">Top Sale</div>
                  <img
                    src="/profile/icon-share.svg"
                    className="w-[9px] h-[9px] shrink-0 object-center object-contain"
                  />
                </div>
                <div className="font-[DelaGothicOne] text-[20px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[85px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.top_sale, 2, true, {
                      prefix: "$"
                    })
                  )}
                </div>
                <div className="text-[#4DD561] text-[12px] mt-[2px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[25px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.top_sale_percentage, 2, true, {
                      prefix: "+"
                    }) + "%"
                  )}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#2B2C2F] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                <div className="flex justify-center items-center gap-[7px]">
                  <div className="font-[DelaGothicOne]">Avg. Profit</div>
                </div>
                <div className="font-[DelaGothicOne] text-[20px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[85px] h-[12px] rounded-full" />
                  ) : (
                    "+" +
                    formatNumber(referenceData?.avg_profit, 2, true, {
                      prefix: "$"
                    })
                  )}
                </div>
                <div className="text-[#4DD561] text-[12px] mt-[2px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[25px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(
                      referenceData?.avg_profit_percentage,
                      2,
                      true,
                      { prefix: "+" }
                    ) + "%"
                  )}
                </div>
              </div>
              <div className="rounded-[10px] border border-[#2B2C2F] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                <div className="flex justify-center items-center gap-[7px]">
                  <div className="font-[DelaGothicOne]">Live</div>
                </div>
                <div className="font-[DelaGothicOne] text-[20px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[85px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.live, 0, true, { prefix: "$" })
                  )}
                </div>
                <div className="text-[#4DD561] text-[12px] mt-[2px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[25px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.new_live, 0, true, {
                      prefix: "+"
                    }) + " new"
                  )}
                </div>
              </div>
            </div>
            <div className="w-full mt-[30px] grid grid-cols-2 h-[210px] place-items-center">
              <DoughnutChart
                className="!w-[210px] !h-[210px]"
                data={poolCashOutTiming}
                formatLabel={(record: any) => {
                  return (
                    <div className="flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[#BBACA6]">Cash out timing</div>
                      <div className="font-[DelaGothicOne] text-[20px]">
                        in {record.label} days
                      </div>
                      <div className="text-[16px] mt-[10px] text-[#BBACA6]">
                        {record.percentage}%
                      </div>
                    </div>
                  );
                }}
              />
              <DoughnutChart
                className="!w-[210px] !h-[210px]"
                data={poolBidsOvermarket}
                formatLabel={(record: any) => {
                  return (
                    <div className="flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[16px]">{record.label} BTC</div>
                      <div className="text-[#BBACA6] mt-[4px]">
                        Bids overmarket
                      </div>
                      <div className="font-[DelaGothicOne] text-[20px] mt-[1px]">
                        {formatNumber(record.value, 2, true, {
                          isShort: true,
                          isShortUppercase: true
                        })}{" "}
                        Bids
                      </div>
                      <div className="text-[16px] mt-[6px] text-[#BBACA6]">
                        {record.percentage}%
                      </div>
                    </div>
                  );
                }}
              />
            </div>
            <PriceChart
              anchorPrice={amount * pricePerBTC}
              className="mt-[36px] rounded-[10px] border border-[#2B2C2F] h-[379px]"
            />
          </div>
        </div>
        <div className="w-[316px] shrink-0">
          <div className="text-[#BBACA6]">Account</div>
          <div className="w-full rounded-[16px] border border-[#6A5D3A] bg-[#35302B] mt-[10px]">
            <div className="w-full rounded-t-[16px] bg-black/20 p-[18px_15px]">
              <div className="">{formatAddress(address)}</div>
              <div className="text-center text-[#BBACA6] mt-[17px]">
                Balance
              </div>
              <div className="mt-[13px] text-center text-[16px] font-[DelaGothicOne]">
                {isLoading ? (
                  <Loading size={12} />
                ) : (
                  `${formatNumber(tokenBalance, 2, true)} BTC`
                )}
              </div>
            </div>
            <div className="w-full p-[30px_15px]">
              <div className="text-center font-[700] text-[16px]">Recharge</div>
              <Recharge
                token={BASE_TOKEN}
                className="mt-[7px]"
                tokenPanelClassName="!bg-black/20 !rounded-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
