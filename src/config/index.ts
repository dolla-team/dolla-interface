// Use relative path to avoid CORS issues in both dev and production
// export const HOST_API = import.meta.env.DEV ? "/api" : "/";
import config from "@/config/solana";

export const HOST_API = config.host_api;

export const PURCHASE_TOKEN = {
  address: "0x26591f0f2bbab1bb3cd457eE1dfd80EAE1474C6c",
  decimals: 18,
  icon: "/currency/usdc.png",
  name: "USDC.e",
  symbol: "USDC.e"
};

export const INVATE_ACTIVE = false;

// FIXME
export const BETTING_CONTRACT_ADDRESS = "";

export const CHAIN = "near" as "solana" | "near";
