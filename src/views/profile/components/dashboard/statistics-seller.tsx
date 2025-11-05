import clsx from "clsx";
import LabelValue from "../label-value";
import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";
import { useNavigate } from "@/libs/router";
import { getProfitFee } from "@/utils/pool";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../popover-card";
import { BASE_TOKEN } from "@/config/btc";

const StatisticsSeller = (props: any) => {
  const { className, pnlList, pnl } = props;

  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [onSellTotalAmount] = useMemo(() => {
    const _result: any = [Big(0), Big(0)];
    if (!userInfo) {
      return _result;
    }

    if (userInfo.on_sell) {
      _result[0] = userInfo.on_sell
        .filter(
          (item: any) =>
            item.reward_token_info?.[0]?.address === BASE_TOKEN.address
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

  const PnlAmount = (
    <span>
      {Big(userInfo?.seller_profit || 0).lt(0) ? "-" : "+"}
      {formatNumber(Big(userInfo?.seller_profit || 0).abs(), 2, true, {
        prefix: "$",
        isShort: true,
        isShortUppercase: true
      })}
    </span>
  );

  const ActiveListingsAmount = (
    <div
      className={clsx(
        "text-[16px] text-[#2B3337] font-[700]",
        userInfo?.on_sell?.length > 0
          ? "border-b border-[#8A87AA] border-dotted pb-[4px] button"
          : ""
      )}
    >
      {formatNumber(onSellTotalAmount, 3, true, {
        isShort: true,
        isShortUppercase: true
      })}{" "}
      {BASE_TOKEN.symbol}
    </div>
  );

  return (
    <div
      className={clsx(
        "flex items-center gap-[18px] pl-[13px] mt-[10px] max-md:mt-[13px] max-md:flex-col max-md:gap-[20px] max-md:pl-0 max-md:pb-0",
        className
      )}
    >
      <div className="flex flex-col justify-center items-center gap-[15px] p-[20px_32px_33px] bg-black text-white rounded-[16px] shrink-0">
        <div className="text-[12px]">Market Sold</div>
        <div className="font-[600] text-[32px] mt-[4px]">{userInfo?.sold}</div>
      </div>
      <div className="flex-1">
        <div className="bg-[#E4E4E4] h-[1px]" />
        <div className="flex items-center">
          <div className="flex items-center gap-[32px] max-md:w-full w-[404px]">
            <LabelValue
              label={
                <div className="flex items-center gap-[4px]">
                  <span>PnL</span>
                  <PnlInfo />
                </div>
              }
              className=""
              valueClassName={clsx(
                !Big(userInfo?.seller_profit || 0).eq(0) &&
                  "border-b border-[#8A87AA] border-dotted pb-[4px] button",
                Big(userInfo?.seller_profit || 0).lt(0)
                  ? "text-[#FF399F]"
                  : "text-[#27C627]"
              )}
            >
              {pnlList.length === 0 ? (
                PnlAmount
              ) : (
                <PnlAmountInfo list={pnlList}>{PnlAmount}</PnlAmountInfo>
              )}
            </LabelValue>
          </div>
          <div className="w-[1px] h-[70px] mt-[10px] shrink-0 bg-[#E4E4E4] max-md:hidden"></div>
          <div className="flex items-center pl-[30px] gap-[50px] flex-2 max-md:flex-col max-md:w-full">
            <LabelValue
              label="Markets Created"
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
                        {userInfo?.ended} Sold
                      </div>
                    </div>
                  </PopoverCard>
                }
                placement={PopoverPlacement.Right}
                trigger={PopoverTrigger.Hover}
                closeDelayDuration={0}
              >
                <div
                  className={clsx(
                    userInfo?.created > 0
                      ? "button border-b border-[#8A87AA] border-dotted pb-[4px]"
                      : ""
                  )}
                >
                  {formatNumber(userInfo?.created, 0, true, {
                    isShort: true,
                    isShortUppercase: true
                  })}
                </div>
              </Popover>
            </LabelValue>
            <LabelValue
              label="Active Listings"
              className="max-md:w-full max-md:mt-[10px] max-md:gap-[8px]"
              valueClassName="flex items-center gap-[13px]"
            >
              {userInfo?.on_sell?.length === 0 ? (
                ActiveListingsAmount
              ) : (
                <ActiveListingsInfo list={userInfo?.on_sell || []}>
                  {ActiveListingsAmount}
                </ActiveListingsInfo>
              )}
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

export default StatisticsSeller;

const PnlInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[290px] text-[12px] p-[14px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="font-[300] opacity-80 leading-[120%]">
            <div className="font-[500] text-black">PnL </div>
            <div className="mt-[4px] text-[10px] text-[#5E6B7D]">
              Total profit or loss from your sold markets.
            </div>
          </div>
        </div>
      }
    >
      <button className="relative transition-opacity button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path
            d="M6.5 13C2.91037 13 0 10.0896 0 6.5C0 2.91037 2.91037 0 6.5 0C10.0896 0 13 2.91037 13 6.5C13 10.0896 10.0896 13 6.5 13ZM6.5 11.9167C9.49162 11.9167 11.9167 9.49162 11.9167 6.5C11.9167 3.50838 9.49162 1.08333 6.5 1.08333C3.50838 1.08333 1.08333 3.50838 1.08333 6.5C1.08333 9.49162 3.50838 11.9167 6.5 11.9167ZM5.95833 5.95833C5.95833 5.81467 6.0154 5.6769 6.11698 5.57532C6.21857 5.47373 6.35634 5.41667 6.5 5.41667C6.64366 5.41667 6.78143 5.47373 6.88302 5.57532C6.9846 5.6769 7.04167 5.81467 7.04167 5.95833V9.75C7.04167 9.89366 6.9846 10.0314 6.88302 10.133C6.78143 10.2346 6.64366 10.2917 6.5 10.2917C6.35634 10.2917 6.21857 10.2346 6.11698 10.133C6.0154 10.0314 5.95833 9.89366 5.95833 9.75V5.95833ZM6.44583 4.225C6.24471 4.225 6.05183 4.1451 5.90961 4.00289C5.7674 3.86067 5.6875 3.66779 5.6875 3.46667C5.6875 3.26554 5.7674 3.07266 5.90961 2.93044C6.05183 2.78823 6.24471 2.70833 6.44583 2.70833C6.64696 2.70833 6.83984 2.78823 6.98206 2.93044C7.12427 3.07266 7.20417 3.26554 7.20417 3.46667C7.20417 3.66779 7.12427 3.86067 6.98206 4.00289C6.83984 4.1451 6.64696 4.225 6.44583 4.225Z"
            fill="#8A87AA"
          />
        </svg>
      </button>
    </Popover>
  );
};

const ActiveListingsInfo = ({
  children,
  list
}: {
  children: React.ReactNode;
  list: any[];
}) => {
  const navigate = useNavigate();
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <PopoverCard className="w-[188px] text-[12px] p-[10px] flex flex-col gap-[10px]">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate(`/btc/detail/${item.pool_id}`);
              }}
              className="button text-[#2B3337] text-[12px] w-full h-[36px] bg-[#F2F2F299] hover:bg-[#FFC42F] rounded-[8px] flex items-center justify-between px-[10px]"
            >
              <span>#{item.pool_id}</span>
              <span className="font-[600]">
                {Big(item.reward_amount)
                  .div(10 ** BASE_TOKEN.decimals)
                  .toString()}{" "}
                {BASE_TOKEN.symbol}
              </span>
            </div>
          ))}
        </PopoverCard>
      }
    >
      {children}
    </Popover>
  );
};

const PnlAmountInfo = ({
  children,
  list
}: {
  children: React.ReactNode;
  list: any[];
}) => {
  const columns = [
    {
      title: "Markets",
      dataIndex: "markets",
      width: "35%"
    },
    {
      title: "List Value",
      dataIndex: "list_value",
      width: "25%"
    },
    {
      title: "Sold (-fee)",
      dataIndex: "sold",
      width: "20%"
    },
    {
      title: "PnL",
      dataIndex: "pnl",
      width: "20%",
      align: "right"
    }
  ];

  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <PopoverCard className="w-[484px] text-[12px] p-[10px]">
          <div className="flex items-center text-[12px] text-[#8A87AA]">
            {columns.map((column) => (
              <div
                key={column.title}
                className="flex items-center"
                style={{
                  width: column.width,
                  justifyContent:
                    column.align === "right" ? "flex-end" : "flex-start"
                }}
              >
                {column.title}
              </div>
            ))}
          </div>
          <div className="text-[12px] flex flex-col gap-[8px] mt-[8px] max-h-[200px] overflow-y-auto">
            {list?.map((item) => (
              <div
                key={item.pool_id}
                className="h-[36px] flex items-center border border-[#E4E4E4] rounded-[8px] bg-[#F2F2F299]"
              >
                {columns.map((column, index) => (
                  <div
                    key={column.title + "row"}
                    className={clsx(
                      "text-[12px] text-[#2B3337]",
                      index === 0 && "pl-[8px]",
                      index === columns.length - 1 && "pr-[8px]"
                    )}
                    style={{
                      width: column.width,
                      justifyContent:
                        column.align === "right" ? "flex-end" : "flex-start"
                    }}
                  >
                    {column.dataIndex === "markets" && (
                      <div className="flex items-center gap-[10px]">
                        <span>#{item.pool_id}</span>
                        <span>
                          {item.amount} {BASE_TOKEN.symbol}
                        </span>
                      </div>
                    )}
                    {column.dataIndex === "list_value" && (
                      <span>
                        $
                        {formatNumber(item.list_value, 2, true, {
                          isShort: true,
                          isShortUppercase: true
                        })}
                      </span>
                    )}
                    {column.dataIndex === "sold" && (
                      <span className="font-[600]">
                        $
                        {formatNumber(item.sold, 2, true, {
                          isShort: true,
                          isShortUppercase: true
                        })}
                      </span>
                    )}
                    {column.dataIndex === "pnl" && (
                      <div
                        className={clsx(
                          "font-[500] text-right",
                          Big(item.pnl).lt(0)
                            ? "text-[#FF399F]"
                            : "text-[#27C627]"
                        )}
                      >
                        {Big(item.pnl).gt(0) ? "+" : "-"}$
                        {formatNumber(Big(item.pnl).abs().toString(), 2, true, {
                          isShort: true,
                          isShortUppercase: true
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PopoverCard>
      }
    >
      {children}
    </Popover>
  );
};
