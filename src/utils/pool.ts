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

export const getProfitFee = (pool: any, opts?: { isLog?: boolean; }) => {
  const { isLog = false } = opts || {};

  const netProfit = getNetProfit(pool);
  const reAnchorPrice = getReAnchorPrice(pool);
  const netProfitPercent = netProfit.div(reAnchorPrice);
  if (isLog) {
    console.log("%c------ Calculate Fee Start: pool: %s ------", "background:#03A6A1;color:#fff;", pool.pool_id);
    console.log("BTCPrice: (anchor_price(%o) / 10^decimals(%o)) / 1.2 = %o", pool.anchor_price, QUOTE_TOKEN.decimals, reAnchorPrice.toString());
    console.log("netProfit: accumulative_bids(%o) - BTCPrice(%o) = %o", pool?.accumulative_bids, reAnchorPrice.toString(), netProfit.toString());
    console.log("netProfitPercent: netProfit(%o) / BTCPrice(%o) = %o", netProfit.toString(), reAnchorPrice.toString(), netProfitPercent.toString());
  }

  // net profit = accumulative_bids / anchorPrice

  let finalStageFee = Big(0);
  const calcStageFee = (lowerRate: number, upperRate: number, fee: number) => {
    const highFee = Big(reAnchorPrice).times(upperRate);
    const lowFee = Big(reAnchorPrice).times(lowerRate);
    const finalStageFee = Big(Big(highFee).minus(lowFee)).times(fee);
    return finalStageFee;
  };

  if (isLog) {
    console.log("less than 20% fee: %o", finalStageFee.toString());
  }

  if (netProfitPercent.gte(0.2)) {
    const currentStageFee = calcStageFee(1.2, 1.35, 0.05);
    finalStageFee = Big(finalStageFee).plus(currentStageFee);
    if (isLog) {
      console.log("20% - 35% stage fee: (1.35 x BTCPrice(%o) - 1.2 x BTCPrice(%o)) x 5%(0.05) = %o", reAnchorPrice.toString(), reAnchorPrice.toString(), currentStageFee.toString());
    }
  }
  if (netProfitPercent.gte(0.35)) {
    const currentStageFee = calcStageFee(1.35, 1.5, 0.1);
    finalStageFee = Big(finalStageFee).plus(currentStageFee);
    if (isLog) {
      console.log("35% - 50% stage fee: (1.5 x BTCPrice(%o) - 1.35 x BTCPrice(%o)) x 10%(0.1) = %o", reAnchorPrice.toString(), reAnchorPrice.toString(), currentStageFee.toString());
    }
  }
  if (netProfitPercent.gte(0.5)) {
    const currentStageFee = calcStageFee(1.5, 2, 0.2);
    finalStageFee = Big(finalStageFee).plus(currentStageFee);
    if (isLog) {
      console.log("50% - 100% stage fee: (2 x BTCPrice(%o) - 1.5 x BTCPrice(%o)) x 20%(0.2) = %o", reAnchorPrice.toString(), reAnchorPrice.toString(), currentStageFee.toString());
    }
  }
  if (netProfitPercent.gte(1)) {
    const highFee = Big(reAnchorPrice).times(2);
    const currentStageFee = Big(Big(pool?.accumulative_bids).minus(highFee)).times(0.35);
    finalStageFee = Big(finalStageFee).plus(currentStageFee);
    if (isLog) {
      console.log("over than 100% stage fee: (accumulative_bids(%o) - 2 x BTCPrice(%o)) x 35%(0.35) = %o", pool?.accumulative_bids, reAnchorPrice.toString(), currentStageFee.toString());
    }
  }

  if (isLog) {
    console.log("Final fee: %o", finalStageFee.toString());
    console.log("%c------ Calculate Fee End ------", "background:#03A6A1;color:#fff;");
  }
  return finalStageFee;
};

// 8% penalty
export const penaltyPercent = 0.08;
