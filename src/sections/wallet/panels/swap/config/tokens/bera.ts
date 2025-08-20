import type { Token } from "../types";

export const CHAIN_ID = 80094;

export const bera: { [key: string]: Token } = {
  bera: {
    address: "native",
    isNative: true,
    chainId: CHAIN_ID,
    symbol: "BERA",
    decimals: 18,
    name: "BERA",
    icon: "/tokens/bera.svg",
    color: "#78350F"
  },
  wbera: {
    address: "0x6969696969696969696969696969696969696969",
    chainId: CHAIN_ID,
    symbol: "WBERA",
    decimals: 18,
    name: "WBERA",
    icon: "/tokens/wbera.svg",
    color: "#f5f5f4"
  },
  weth: {
    chainId: CHAIN_ID,
    address: "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
    icon: "/tokens/weth.png",
    color: "#D2D2D2"
  },
  "usdc.e": {
    chainId: CHAIN_ID,
    address: "0x549943e04f40284185054145c6E4e9568C1D3241",
    decimals: 6,
    symbol: "USDC.e",
    name: "USDC.e",
    icon: "/tokens/usdc.png",
    color: "#2775CA"
  },
  honey: {
    address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce",
    chainId: CHAIN_ID,
    symbol: "HONEY",
    decimals: 18,
    name: "HONEY",
    icon: "/tokens/honey.svg",
    color: "#d97706"
  },
  wbtc: {
    chainId: CHAIN_ID,
    address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped BTC",
    icon: "/tokens/wbtc.png",
    color: "#F7931A"
  },
  usdt0: {
    chainId: CHAIN_ID,
    address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
    decimals: 6,
    symbol: "USD₮0",
    name: "USD₮0",
    icon: "/tokens/usdt0.png",
    color: "#059393",
    priceKey: "USDT0"
  }
};
