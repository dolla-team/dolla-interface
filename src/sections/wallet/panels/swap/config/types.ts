export interface Token {
  chainId: number;
  address: string;
  name?: string;
  symbol: string;
  icon: string;
  logoURI?: string;
  decimals: number;
  isNative?: boolean;
  priceKey?: string;
  usd?: string;
  color?: string;
  isMeme?: boolean;
}
