import clsx from "clsx";
import { useMemo, useState } from "react";
import PriceChart from "../nft-create/price-chart";
import { BASE_TOKEN } from "@/config/btc";
import { formatNumber } from "@/utils/format/number";
import useTokenPrice from "@/hooks/use-token-price";
import { motion } from "framer-motion";
import Button from "@/components/button";
import DoughnutChart from "./doughnut-chart";
import { useReferenceData } from "./hooks/use-reference-data";
import Skeleton from "@/components/skeleton";
import Big from "big.js";
import useIsMobile from "@/hooks/use-is-mobile";
import SuccessModal from "./success-modal";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import Loading from "@/components/icons/loading";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import useQuote from "./hooks/use-quote";
import useWalletStore from "@/stores/use-wallet";
import PageBack from "@/views/profile/components/page-back";
import { AMOUNT } from "@/config/btc";
import ConfirmModal from "./confirm-modal";

export default function BTCCreate() {
  const [amount, setAmount] = useState(AMOUNT[1]);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    userInfo,
    isLoading,
    updateNearAccount,
    nearAccount,
    address,
    login
  } = useAuth() || {};
  const { token } = useQuote();
  const tokenBalance = nearAccount?.prizeBalance;
  const {
    data: referenceData,
    loading: referenceDataLoading,
    bidsMarket
  } = useReferenceData({ token: BASE_TOKEN, amount });

  const isMobile = useIsMobile();

  const { prices } = useTokenPrice(BASE_TOKEN);

  const walletStore = useWalletStore();

  const pricePerBTC = useMemo(() => {
    if (BASE_TOKEN.address === "usdt.tether-token.near") {
      return 1;
    }
    if (!prices || prices?.length === 0) return 0;
    const _p = prices[0].last_price;
    return _p;
  }, [prices]);

  const errorTips = useMemo(() => {
    if (pricePerBTC === 0) {
      return "Anchor price not found";
    }
    if (Big(amount).gt(Big(nearAccount?.prizeBalance || 0))) {
      return `Insufficient ${BASE_TOKEN.symbol} Balance`;
    }

    return "";
  }, [amount, pricePerBTC, nearAccount?.prizeBalance]);

  return (
    <div className="relative">
      <div className="w-full relative z-[2] text-[14px] font-[400] leading-[100%] pt-[30px] pb-[60px] max-md:pt-[80px]">
        <PageBack className="!border-[#555555] !bg-[#FFFFFF33] !text-[#fff] !top-[20px]" />
        <Title />
        <div className="w-[1200px] mx-auto gap-[15px] pt-[42px] max-md:w-full max-md:pt-[40px]">
          <div
            className="w-full h-[212px] p-[30px] rounded-[20px]"
            style={{
              background:
                "radial-gradient(30% 30% at 0% 0%, rgba(255, 196, 47, 0.30) 0%, rgba(255, 196, 47, 0.00) 100%), #000" // Adjusted to show gradient only in top-left corner
            }}
          >
            <div className="flex items-center">
              <div>
                <div className="text-white flex justify-between items-center">
                  <div className="">Create Market</div>
                </div>
                <div className="flex items-center">
                  <div className="mt-[13px] flex items-center gap-[10px]">
                    {AMOUNT.map((item, index) => {
                      const isActive = amount === item;
                      return (
                        <motion.div
                          key={index}
                          className={clsx(
                            "button rounded-[12px] flex flex-col items-center justify-center gap-[9px] border w-[196px] h-[106px]",
                            !isActive
                              ? "backdrop-blur-[10px] text-white"
                              : "text-black"
                          )}
                          onClick={() => setAmount(item)}
                          initial={{ height: 106 }}
                          animate={{
                            height: !isMobile ? (isActive ? 120 : 106) : 106,
                            borderColor: isActive ? "#E4E4E4" : "#A2A2A2",
                            backgroundColor: isActive
                              ? "#FFFFFF"
                              : "transparent"
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
                </div>
              </div>
              <div className="w-[1px] h-[158px] bg-[#424242] mx-[30px]" />
              <div className="relative flex-1 h-[158px]">
                <div className="text-center text-white text-[14px] font-[500]">
                  {userInfo?.name || formatAddress(userInfo?.user)}
                </div>
                <div className="mt-[20px] text-center text-[20px] font-[700] text-white">
                  {isLoading ? (
                    <Loading size={12} />
                  ) : (
                    `${formatNumber(tokenBalance, 6, true)} ${token.symbol}`
                  )}
                </div>
                <button
                  onClick={(ev: any) => {
                    if (!address) {
                      login();
                      return;
                    }
                    ev.stopPropagation();
                    walletStore.set({
                      showWallet: true,
                      panelType: "deposit",
                      depositPanelType: "input",
                      selectedToken: token,
                      defaultDepositAmount: amount
                    });
                  }}
                  className="absolute top-0 right-0 w-[86px] h-[30px] button rounded-[8px] border border-[#A2A2A2] bg-[#FFFFFF1A] text-white text-[12px] text-center"
                >
                  Deposit
                </button>
                <div className="text-center text-[14px] text-white mt-[10px]">
                  Balance
                </div>
                <Button
                  disabled={!!errorTips}
                  className="mt-[20px] w-[466px] h-[50px] !bg-[#FFC42F]"
                  onClick={() => {
                    if (errorTips) return;
                    setShowConfirmModal(true);
                  }}
                >
                  {errorTips || "Create Market"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-[29px] mt-[36px] rounded-[12px] bg-[#FFFFFF99] p-[24px] w-full max-md:mt-[40px] max-md:px-[12px]">
            <div className="w-1/2">
              <div className="text-[16px] text-black font-[500]">
                {amount} {BASE_TOKEN.symbol} Markets Reference Data
              </div>
              <div className="w-full grid grid-cols-3 gap-[10px] mt-[26px] max-md:mt-[15px] max-md:gap-[7px]">
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
                  data={referenceData?.timing || []}
                  formatLabel={(record: any) => {
                    return (
                      <div className="flex flex-col items-center justify-center gap-[5px]">
                        <div className="text-[12px] text-[#8A87AA] rounded-[12px] border border-[#E4E4E4] bg-white px-[12px] py-[4px]">
                          {amount} {BASE_TOKEN.symbol}
                        </div>
                        {!isMobile && (
                          <div className="text-[#8A87AA] text-[12px]">
                            Cash out timing
                          </div>
                        )}
                        <div className="text-[16px] font-[800]">
                          {record.label}
                        </div>
                        <div className="text-[12px] mt-[10px] text-[#8A87AA]">
                          {record.percentage}%
                        </div>
                      </div>
                    );
                  }}
                />
                {isMobile && (
                  <div className="text-[#FFE9B2] text-[16px] text-left w-full mt-[30px]">
                    Bids overmarket
                  </div>
                )}
                <DoughnutChart
                  className="!w-[210px] !h-[210px] max-md:mt-[12px]"
                  data={bidsMarket}
                  volume={amount.toString()}
                  formatLabel={(record: any) => {
                    return (
                      <div className="flex flex-col items-center justify-center gap-[5px]">
                        <div className="text-[12px] text-[#8A87AA] rounded-[12px] border border-[#E4E4E4] bg-white px-[12px] py-[4px]">
                          {record.label} {BASE_TOKEN.symbol}
                        </div>
                        {!isMobile && (
                          <div className="text-[#8A87AA] mt-[4px]">
                            Bids overmarket
                          </div>
                        )}
                        <div className="font-[800] text-[16px] mt-[1px]">
                          {formatNumber(record.bids, 2, true, {
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
            </div>
            <PriceChart
              anchorPrice={amount * pricePerBTC}
              className="mt-[40px] rounded-[12px] bg-[#EAEAEA] h-[379px] !w-1/2"
            />
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[285px] bg-[url('/btc/btc-create-bg.jpg')] bg-cover bg-top bg-no-repeat z-0 pointer-events-none" />
      <SuccessModal
        open={!!successResult}
        data={successResult}
        onClose={() => setSuccessResult(null)}
      />
      <ConfirmModal
        open={showConfirmModal}
        amount={amount}
        pricePerBTC={pricePerBTC}
        onSuccess={(id: string) => {
          updateNearAccount?.();

          // navigate("/portfolio/seller");
          setSuccessResult({
            pool_id: id,
            amount
          });
        }}
        onClose={() => {
          setShowConfirmModal(false);
        }}
      />
    </div>
  );
}

const Title = () => {
  return (
    <div className="flex items-center justify-center gap-[10px] text-white">
      <span className="text-[20px] font-[500]">
        Create {BASE_TOKEN.symbol} Market
      </span>
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
        <button className="relative transition-opacity button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 0C12.4615 5.7067e-07 16 3.6154 16 8C16 12.3846 12.4615 16 8 16C3.6154 16 1.05567e-05 12.4615 0 8C0 3.53847 3.53847 0 8 0ZM8 1.53809C4.46155 1.53809 1.53809 4.46155 1.53809 8C1.5381 11.5384 4.38463 14.4619 8 14.4619C11.6154 14.4619 14.4619 11.5384 14.4619 8C14.4619 4.46155 11.5385 1.53809 8 1.53809ZM8.76953 12.6152H7.23047V6H8.76953V12.6152ZM8.76953 4.69238H7.23047V3.23047H8.76953V4.69238Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </Popover>
    </div>
  );
};
