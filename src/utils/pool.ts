import axiosInstance from "@/libs/axios";
import Big from "big.js";
import { QUOTE_TOKEN } from "@/config/btc";

export const getPoolInfo = async (poolId: number) => {
  const res = await axiosInstance.get(`/api/v1/pool?pool_id=${poolId}`);
  return res.data.data;
};

export const getAnchorPrice = (pool: any) => {
  if (pool?.anchor_price)
    return Big(pool.anchor_price * 1)
      .div(10 ** QUOTE_TOKEN.decimals)
      .toNumber();
  return 0;
};

export const getReAnchorPrice = (pool: any) => {
  if (pool?.anchor_price)
    return Big(pool.anchor_price)
      .div(1.2)
      .div(10 ** QUOTE_TOKEN.decimals)
      .toNumber();
  return 0;
};

export const getNetProfit = (pool: any) => {
  if (pool?.accumulative_bids) {
    return Big(pool.accumulative_bids).minus(getReAnchorPrice(pool));
  }
  return Big(0);
};

export const getProfitFee = (pool: any, opts?: { isLog?: boolean;}) => {
  const { isLog = false } = opts || {};

  const netProfit = getNetProfit(pool);
  const reAnchorPrice = getReAnchorPrice(pool);
  const netProfitPercent = netProfit.div(reAnchorPrice);
  if (isLog) {
    console.log("------ Calculate Fee Start: pool: %o ------", pool.pool_id);
    console.log("netProfit: %o", netProfit.toString());
    console.log("reAnchorPrice: %o", reAnchorPrice.toString());
    console.log("netProfitPercent: %o", netProfitPercent.toString());
  }
  // net profit = accumulative_bids / anchorPrice
  // < 20%           =   0   fee
  // >= 20% & < 35%  =   5%  fee
  // >= 35% & < 50%  =   10% fee
  // >= 50% & < 100% =   20% fee
  // >= 100%         =   35% fee
  if (netProfitPercent.lt(0.2)) {
    if (isLog) {
      console.log("finalFee: %o", Big(0).toString());
      console.log("------ Calculate Fee End ------");
    }
    return Big(0);
  }
  if (netProfitPercent.gte(0.2) && netProfitPercent.lt(0.35)) {
    const highFee = Big(reAnchorPrice).times(1.35);
    const lowFee = Big(reAnchorPrice).times(1.2);
    const finalFee = Big(Big(highFee).minus(lowFee)).times(0.05);
    if (isLog) {
      console.log("finalFee: %o", finalFee.toString());
      console.log("------ Calculate Fee End ------");
    }
    return finalFee;
  }
  if (netProfitPercent.gte(0.35) && netProfitPercent.lt(0.5)) {
    const highFee = Big(reAnchorPrice).times(1.5);
    const lowFee = Big(reAnchorPrice).times(1.35);
    const finalFee = Big(Big(highFee).minus(lowFee)).times(0.1);
    if (isLog) {
      console.log("finalFee: %o", finalFee.toString());
      console.log("------ Calculate Fee End ------");
    }
    return finalFee;
  }
  if (netProfitPercent.gte(0.5) && netProfitPercent.lt(1)) {
    const highFee = Big(reAnchorPrice).times(2);
    const lowFee = Big(reAnchorPrice).times(1.5);
    const finalFee = Big(Big(highFee).minus(lowFee)).times(0.2);
    if (isLog) {
      console.log("finalFee: %o", finalFee.toString());
      console.log("------ Calculate Fee End ------");
    }
    return finalFee;
  }
  const highFee = Big(reAnchorPrice).times(2);
  const lowFee = Big(reAnchorPrice).times(1.5);
  const finalFee = Big(Big(highFee).minus(lowFee)).times(0.35);
  if (isLog) {
    console.log("finalFee: %o", finalFee.toString());
    console.log("------ Calculate Fee End ------");
  }
  return finalFee;
};

// 8% penalty
export const penaltyPercent = 0.08;
