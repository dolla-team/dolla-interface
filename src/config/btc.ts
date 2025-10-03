// btc
// export const BASE_TOKEN: Record<string, any> = {
//   address: config.base_contract,
//   decimals: config.base_token_decimals,
//   chain: "solana",
//   name: "BTC",
//   symbol: "BTC",
//   pointIcon: "/points/btc.png"
// };
// // usdc
// export const QUOTE_TOKEN: Record<string, any> = {
//   address: config.quote_contract,
//   decimals: config.quote_token_decimals,
//   chain: "solana",
//   name: "USDT",
//   pointIcon: "/points/usdt.png"
// };

export const BASE_TOKEN: Record<string, any> = {
  assetId:
    "nep141:2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
  address: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
  decimals: 8,
  chain: "near",
  name: "wBTC",
  symbol: "BTC",
  icon: "/tokens/btc.png",
  pointsIcon: "/tokens/btc.png",
  isBaseToken: true
};

export const QUOTE_TOKEN: Record<string, any> = {
  assetId: "nep141:usdt.tether-token.near",
  address: "usdt.tether-token.near",
  decimals: 6,
  chain: "near",
  name: "USDT",
  symbol: "USDT",
  icon: "/tokens/usdt.png",
  pointsIcon: "/tokens/usdt.png"
};

// export const QUOTE_TOKEN: Record<string, any> = {
//   assetId:
//     "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
//   address: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
//   decimals: 6,
//   chain: "near",
//   name: "USDC",
//   symbol: "USDC",
//   icon: "/tokens/usdc.png",
//   pointsIcon: "/tokens/usdc.png"
// };

export const PAID_TOKEN = QUOTE_TOKEN;
