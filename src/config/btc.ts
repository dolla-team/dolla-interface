export const BASE_TOKEN: Record<string, any> = {
  assetId: "nep141:eth.bridge.near",
  address: "eth.bridge.near",
  decimals: 18,
  chain: "near",
  name: "ETH",
  symbol: "ETH",
  icon: "/tokens/eth.png",
  pointsIcon: "/tokens/eth.png",
  isBaseToken: true,
  minDepositAmount: "0.001"
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

export const AMOUNT = [1, 0.1, 0.01];
