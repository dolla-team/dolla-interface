import config from "@/config/solana";

export const TOKEN = {
  address: "0x0821bdfcbcd53837b4a8341427155a3d67290afe",
  decimals: 18,
  name: "BTC",
  symbol: "BTC",
  icon: "/btc.png",
  chain: "Berachain"
};

// btc
export const BASE_TOKEN: Record<string, any> = {
  address: config.base_contract,
  decimals: config.base_token_decimals,
  chain: "solana",
  name: "BTC",
  symbol: "BTC",
  pointIcon: "/points/btc.png"
};
// usdc
export const QUOTE_TOKEN: Record<string, any> = {
  address: config.quote_contract,
  decimals: config.quote_token_decimals,
  chain: "solana",
  name: "USDT",
  pointIcon: "/points/usdt.png"
};

export const PAID_TOKEN = QUOTE_TOKEN;
