import axiosInstance from "@/libs/axios";
import Big from "big.js";
import { QUOTE_TOKEN } from "@/config/btc";

export const getPoolInfo = async (poolId: number) => {
  const res = await axiosInstance.get(`/api/v1/pool?pool_id=${poolId}`);
  return res.data.data;
};

export const getAnchorPrice = (pool: any) => {
  if (pool?.anchor_price)
    return Big(pool.anchor_price * 1.2)
      .div(10 ** QUOTE_TOKEN.decimals)
      .toNumber();
  return 0;
};

export const getNetProfit = (pool: any) => {
  if (pool?.accumulative_bids) {
    return Big(pool.accumulative_bids).minus(getAnchorPrice(pool));
  }
  return Big(0);
};

export const getProfitFee = (pool: any) => {
  const netProfit = getNetProfit(pool);
  const netProfitPercent = netProfit.div(getAnchorPrice(pool));
  // net profit = accumulative_bids / anchorPrice
  // < 20%           =   0   fee
  // >= 20% & < 35%  =   5%  fee
  // >= 35% & < 50%  =   10% fee
  // >= 50% & < 100% =   20% fee
  // >= 100%         =   35% fee
  if (netProfitPercent.lt(0.2)) {
    return Big(0);
  }
  if (netProfitPercent.gte(0.2) && netProfitPercent.lt(0.35)) {
    return netProfit.mul(0.05);
  }
  if (netProfitPercent.gte(0.35) && netProfitPercent.lt(0.5)) {
    return netProfit.mul(0.1);
  }
  if (netProfitPercent.gte(0.5) && netProfitPercent.lt(1)) {
    return netProfit.mul(0.2);
  }
  return netProfit.mul(0.35);
};
