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
  // arb
  createOriginAssetId:
    "nep141:arb-0xaf88d065e77c8cc2239327c5edb3a432268e5831.omft.near",
  createChainName: "Arbitrum",
  createChainLogo: "/chains/arb.svg",
  createTokenName: "USDC",
  createTokenIcon: "/tokens/usdc.png",
  destinationAssetId:
    "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
  address: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
  decimals: 6,
  chain: "near",
  name: "BTC",
  symbol: "BTC",
  pointIcon: "/points/btc.png",
  icon: "/btc.png"
};

export const QUOTE_TOKEN: Record<string, any> = {
  assetId:
    "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
  address: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
  decimals: 6,
  chain: "near",
  name: "USDC",
  pointIcon: "/points/usdt.png"
};

export const PAID_TOKEN = QUOTE_TOKEN;
