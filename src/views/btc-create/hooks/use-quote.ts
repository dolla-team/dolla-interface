import { BASE_TOKEN } from "@/config/btc";

export default function useQuote() {
  return {
    token: {
      symbol: BASE_TOKEN.symbol,
      icon: BASE_TOKEN.icon,
      address: BASE_TOKEN.address,
      decimals: BASE_TOKEN.decimals,
      ...BASE_TOKEN
    }
  };
}
