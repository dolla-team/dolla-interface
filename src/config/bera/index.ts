const config: Record<string, any> = {
  testnet: {
    bettingContractAddress: "0x48e66c1BE57C807E09C0AdeC7Dc300A5C058E919",
    purchaseToken: {
      address: "0x26591f0f2bbab1bb3cd457eE1dfd80EAE1474C6c",
      decimals: 18,
      icon: "/currency/usdc.png",
      name: "USDC.e",
      symbol: "USDC.e"
    },
    host_api: "https://test-api.dolla.market"
  },
  mainnet: {
    bettingContractAddress: "",
    host_api: "https://stg-api.dolla.market"
  }
};

export default config[import.meta.env.VITE_BERA_ENV || "testnet"];
