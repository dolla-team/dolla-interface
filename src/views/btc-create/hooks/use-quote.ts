import { BASE_TOKEN } from "@/config/btc";

export default function useQuote(amount: number) {
  return {
    token: {
      symbol: BASE_TOKEN.createTokenName,
      icon: BASE_TOKEN.createTokenIcon,
      chainName: BASE_TOKEN.createChainName,
      chainLogo: BASE_TOKEN.createChainLogo,
      address: BASE_TOKEN.address,
      decimals: BASE_TOKEN.decimals
    }
  };
}
