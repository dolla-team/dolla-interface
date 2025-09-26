import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import PriceChart from "../nft-create/price-chart";
import { BASE_TOKEN } from "@/config/btc";
import { formatNumber } from "@/utils/format/number";
import useTokenPrice from "@/hooks/use-token-price";
import { motion } from "framer-motion";
import Button from "@/components/button";
import DoughnutChart from "./doughnut-chart";
import { useReferenceData } from "./hooks/use-reference-data";
import Skeleton from "@/components/skeleton";
import { useConfigStore } from "@/stores/use-config";
import Big from "big.js";
import useIsMobile from "@/hooks/use-is-mobile";
import Modal from "@/components/modal";
import useConfig from "@/hooks/use-config";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import Loading from "@/components/icons/loading";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import useQuote from "./hooks/use-quote";
import useWalletStore from "@/stores/use-wallet";
import useCreate from "@/hooks/near/use-create";

export default function BTCCreate() {
  const [amount, setAmount] = useState(1);
  const { userInfo, isLoading, updateNearAccount, nearAccount } =
    useAuth() || {};
  const { token } = useQuote();
  const tokenBalance = nearAccount?.balance;
  const { data: referenceData, loading: referenceDataLoading } =
    useReferenceData({ token: BASE_TOKEN, amount });

  const globalConfig = useConfigStore((state) => state.config);

  const isMobile = useIsMobile();

  const { prices } = useTokenPrice(BASE_TOKEN);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const pricePerBTC = useMemo(() => {
    if (!prices || prices?.length === 0) return 0;
    const _p = prices[0].last_price;
    return _p;
  }, [prices]);

  const { create: onCreate, loading: creating } = useCreate(() => {
    updateNearAccount?.();
  });

  const errorTips = useMemo(() => {
    if (pricePerBTC === 0) {
      return "Anchor price not found";
    }
    if (Big(amount).gt(Big(nearAccount?.prizeBalance || 0))) {
      return "Insufficient Balance";
    }
    return "";
  }, [amount, pricePerBTC, nearAccount?.prizeBalance]);

  const [poolBidsOvermarket] = useMemo(() => {
    return [
      globalConfig?.pool_cash_out_timing?.map((_item: any) => ({
        label: _item.days,
        value: _item.volume,
        percentage: _item.percentage[0]
      })) || [],
      globalConfig?.pool_bids_overmarket?.map((_item: any) => ({
        label: Big(_item.volume || 0)
          .div(10 ** token.decimals)
          .toNumber(),
        value: _item.bid,
        percentage: _item.percentage[0]
      })) || []
    ];
  }, [globalConfig]);

  return (
    <div className="w-full text-[14px] font-[400] leading-[100%] pt-[40px] pb-[60px] max-md:pt-[80px]">
      <Title />
      <div className="w-[894px] mx-auto flex justify-between items-start gap-[15px] pt-[42px] max-md:w-full max-md:pt-[40px]">
        <div className="flex-1 w-0">
          <div className="w-full max-md:px-[12px]">
            <div className="text-[#8A87AA] flex justify-between items-center">
              <div className="">Amount</div>
              {isMobile && (
                <div
                  className="underline underline-offset-2 text-white text-[16px] font-[600]"
                  onClick={() => {
                    setDepositModalOpen(true);
                  }}
                >
                  Deposit BTC
                </div>
              )}
            </div>
            <div className="mt-[13px] flex items-center gap-[10px] h-[97px] max-md:grid max-md:grid-cols-2 max-md:h-[unset]">
              {[1, 0.1, 0.01].map((item, index) => {
                const isActive = amount === item;
                return (
                  <motion.div
                    key={index}
                    className={clsx(
                      "button rounded-[20px] flex flex-col items-center justify-center gap-[9px]",
                      "max-md:w-full",
                      isActive ? "backdrop-blur-[10px]" : ""
                    )}
                    onClick={() => setAmount(item)}
                    initial={{ width: "25%" }}
                    animate={{
                      width: !isMobile
                        ? isActive
                          ? "calc(33.33% + 34px)"
                          : "calc(33.33% - 11.33px)"
                        : "100%",
                      height: !isMobile ? (isActive ? 97 : 78) : 78,
                      borderColor: !isMobile
                        ? isActive
                          ? "#FFE9B2"
                          : "transparent"
                        : "#605D55",
                      backgroundColor: isActive ? "#FFC42F" : "white"
                    }}
                    style={{
                      fontSize: isActive ? 20 : 16
                    }}
                  >
                    <div className="text-[14px] font-[800]">
                      {item} {BASE_TOKEN.symbol}
                    </div>
                    <div className={clsx("text-[12px]")}>
                      ~${formatNumber(item * pricePerBTC, 0, true)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <Button
              disabled={!!errorTips}
              className="mt-[20px] w-full h-[40px] !bg-[#000] !text-white"
              loading={creating}
              onClick={() => {
                if (errorTips || creating) return;
                onCreate({
                  amount: amount.toString(),
                  price: pricePerBTC
                });
              }}
            >
              {errorTips || "Create Market"}
            </Button>
          </div>
          {errorTips === "Insufficient Balance" && (
            <div className="text-[12px] text-[#F87168] text-center mt-[6px]">
              Insufficient Balance, deposit BTC first
            </div>
          )}
          <div className="mt-[36px] rounded-[12px] bg-[#FFFFFF99] p-[24px] w-full max-md:mt-[40px] max-md:px-[12px]">
            <div className="text-[#8A87AA]">Reference Data</div>
            <div className="w-full grid grid-cols-3 gap-[10px] mt-[11px] max-md:mt-[15px] max-md:gap-[7px]">
              <div className="rounded-[12px] bg-[#EAEAEA] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                <div className="flex justify-center items-center gap-[7px]">
                  <div className="text-[12px]">Top Sale</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path d="M1 9.5L9.5 1M9.5 1H1M9.5 1V9.5" stroke="black" />
                  </svg>
                </div>
                <div className="font-[600] text-[16px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[85px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.top_sale, 2, true, {
                      prefix: "$"
                    })
                  )}
                </div>
                {/* <div className="text-[#4DD561] text-[12px] mt-[2px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[25px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.top_sale_percentage, 2, true, {
                      prefix: "+"
                    }) + "%"
                  )}
                </div> */}
              </div>
              <div className="rounded-[12px] bg-[#EAEAEA] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                <div className="flex justify-center items-center gap-[7px]">
                  <div className="text-[12px]">Avg. Profit</div>
                </div>
                <div className="font-[600] text-[16px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[85px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.avg_profit, 2, true, {
                      prefix: "$"
                    })
                  )}
                </div>
                {/* <div className="text-[#4DD561] text-[12px] mt-[2px]">
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
                </div> */}
              </div>
              <div className="rounded-[12px] bg-[#EAEAEA] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                <div className="flex justify-center items-center gap-[7px]">
                  <div className="text-[12px]">Live</div>
                </div>
                <div className="font-[600] text-[16px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[85px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.live, 0, true)
                  )}
                </div>
                {/* <div className="text-[#4DD561] text-[12px] mt-[2px]">
                  {referenceDataLoading ? (
                    <Skeleton className="w-[25px] h-[12px] rounded-full" />
                  ) : (
                    formatNumber(referenceData?.new_live, 0, true, {
                      prefix: "+"
                    }) + " new"
                  )}
                </div> */}
              </div>
            </div>
            <div className="w-full mt-[30px] grid grid-cols-2 h-[210px] place-items-center max-md:grid-cols-1 max-md:mt-[28px] max-md:h-[unset]">
              {isMobile && (
                <div className="text-[#FFE9B2] text-[16px] text-left w-full">
                  Cash out timing
                </div>
              )}
              <DoughnutChart
                className="!w-[210px] !h-[210px] max-md:mt-[12px]"
                // data={poolCashOutTiming}
                data={[]}
                formatLabel={(record: any) => {
                  return <div className="text-[#8A87AA]">Comming soon...</div>;
                  // return (
                  //   <div className="flex flex-col items-center justify-center gap-[5px]">
                  //     {!isMobile && (
                  //       <div className="text-[#BBACA6]">Cash out timing</div>
                  //     )}
                  //     <div className="font-[DelaGothicOne] text-[20px]">
                  //       in {record.label} days
                  //     </div>
                  //     <div className="text-[16px] mt-[10px] text-[#BBACA6]">
                  //       {record.percentage}%
                  //     </div>
                  //   </div>
                  // );
                }}
              />
              {isMobile && (
                <div className="text-[#FFE9B2] text-[16px] text-left w-full mt-[30px]">
                  Bids overmarket
                </div>
              )}
              <DoughnutChart
                className="!w-[210px] !h-[210px] max-md:mt-[12px]"
                data={poolBidsOvermarket}
                formatLabel={(record: any) => {
                  return (
                    <div className="flex flex-col items-center justify-center gap-[5px]">
                      <div className="text-[12px] text-[#8A87AA] rounded-[12px] border border-[#E4E4E4] bg-white px-[12px] py-[4px]">
                        {record.label} BTC
                      </div>
                      {!isMobile && (
                        <div className="text-[#8A87AA] mt-[4px]">
                          Bids overmarket
                        </div>
                      )}
                      <div className="font-[800] text-[16px] mt-[1px]">
                        {formatNumber(record.value, 2, true, {
                          isShort: true,
                          isShortUppercase: true
                        })}{" "}
                        Bids
                      </div>
                      <div className="text-[12px] mt-[10px] text-[#8A87AA]">
                        {record.percentage}%
                      </div>
                    </div>
                  );
                }}
              />
            </div>
            <PriceChart
              anchorPrice={amount * pricePerBTC}
              className="mt-[36px] rounded-[12px] border border-[#E4E4E4] bg-white h-[379px] max-md:h-[479px]"
            />
          </div>
        </div>
        {!isMobile && (
          <DepositBTC
            userInfo={userInfo}
            isLoading={isLoading}
            tokenBalance={tokenBalance}
            isMobile={isMobile}
            token={token}
            amount={amount}
          />
        )}
        <Modal
          open={depositModalOpen}
          onClose={() => {
            setDepositModalOpen(false);
          }}
        >
          <button
            type="button"
            className="absolute right-[17px] top-[18px] w-[10px] h-[11px] shrink-0"
            onClick={() => {
              setDepositModalOpen(false);
            }}
          >
            <img
              src="/icon-close.svg"
              className="w-full h-full object-center object-contain"
            />
          </button>
          <DepositBTC
            userInfo={userInfo}
            isLoading={isLoading}
            tokenBalance={tokenBalance}
            isMobile={isMobile}
            token={token}
            amount={amount}
          />
        </Modal>
      </div>
    </div>
  );
}

const DepositBTC = (props: any) => {
  const { userInfo, isLoading, tokenBalance, isMobile, token, amount } = props;
  const walletStore = useWalletStore();

  return (
    <div className="w-[316px] shrink-0 max-md:w-full">
      {!isMobile && <div className="text-[#8A87AA]">Account</div>}
      <div className="w-full rounded-[16px] border border-[#6A5D3A] bg-[#1C1C23] mt-[10px] max-md:rounded-b-[0] max-md:mt-0">
        <div className="w-full rounded-t-[16px] bg-black/20 p-[18px_15px]">
          <div className="text-white text-[14px]">
            {formatAddress(userInfo?.user)}
          </div>
          <div className="text-center text-white mt-[17px]">Balance</div>
          <div className="mt-[13px] text-center text-[16px] font-[700] text-white">
            {isLoading ? (
              <Loading size={12} />
            ) : (
              `${formatNumber(tokenBalance, 2, true)} ${token.symbol}`
            )}
          </div>
          <Button
            className="mt-[30px] w-full h-[42px] !bg-[#FFC42F]"
            onClick={(ev: any) => {
              ev.stopPropagation();
              walletStore.set({
                showWallet: true,
                panelType: "deposit",
                defaultDepositToken: token.symbol,
                defaultDepositAmount: amount
              });
            }}
          >
            Deposit BTC
          </Button>
        </div>
      </div>
    </div>
  );
};

const Title = () => {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      <span className="text-[20px] font-[500]">Create BTC Market</span>
      <Popover
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.Bottom}
        content={
          <div className="w-[298px] text-[#3B3951] text-[12px] p-[14px] bg-white rounded-[10px] border border-[#E4E4E4]">
            <div className="font-[500]">Refund Conditions</div>
            <div className="font-[300] opacity-80 leading-[120%]">
              Once a seller lists an asset and creates a bidding market, the
              market is locked for 72 hours. During this period, the seller
              cannot close or cancel the market under any circumstances. After
              the initial 72-hour period, if no winner has emerged, the seller
              may choose to close the market manually. However, this action will
              trigger a penalty.
            </div>
          </div>
        }
      >
        <button className="relative hover:opacity-80 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 0C12.4615 5.7067e-07 16 3.6154 16 8C16 12.3846 12.4615 16 8 16C3.6154 16 1.05567e-05 12.4615 0 8C0 3.53847 3.53847 0 8 0ZM8 1.53809C4.46155 1.53809 1.53809 4.46155 1.53809 8C1.5381 11.5384 4.38463 14.4619 8 14.4619C11.6154 14.4619 14.4619 11.5384 14.4619 8C14.4619 4.46155 11.5385 1.53809 8 1.53809ZM8.76953 12.6152H7.23047V6H8.76953V12.6152ZM8.76953 4.69238H7.23047V3.23047H8.76953V4.69238Z"
              fill="#8A87AA"
            />
          </svg>
        </button>
      </Popover>
    </div>
  );
};
