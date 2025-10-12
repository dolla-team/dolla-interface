export const BASE_TOKEN: Record<string, any> = {
  // ETH
  // assetId: "nep141:eth.bridge.near",
  // address: "eth.bridge.near",
  // decimals: 18,
  // chain: "near",
  // name: "ETH",
  // symbol: "ETH",
  // icon: "/tokens/eth.png",
  // pointsIcon: "/tokens/eth.png",
  // isBaseToken: true,
  // minDepositAmount: "0.001"

  // BTC
  assetId: "nep141:nbtc.bridge.near",
  address: "nbtc.bridge.near",
  decimals: 8,
  chain: "near",
  symbol: "BTC",
  icon: "/tokens/btc.png",
  pointsIcon: "/tokens/btc.png",
  isBaseToken: true,
  minDepositAmount: "0.000001"
};

export const QUOTE_TOKEN: Record<string, any> = {
  assetId: "nep141:usdt.tether-token.near",
  address: "usdt.tether-token.near",
  decimals: 6,
  chain: "near",
  name: "USDT",
  symbol: "USDT",
  icon: "/tokens/usdt.png",
  pointsIcon: "/tokens/usdt.png",
  minDepositAmount: "1"
};

export const PAID_TOKEN = QUOTE_TOKEN;

export const AMOUNT = [0.01, 0.001, 0.0001];

export const BTC_DEPOSIT_AMOUNT = "20000";
