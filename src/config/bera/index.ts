const config: Record<string, any> = {
  testnet: {
    bettingContractAddress: "0xcc4658bc953748150D577CE9a4513dF88236671d",
    purchaseToken: {
      address: "0x26591f0f2bbab1bb3cd457eE1dfd80EAE1474C6c",
      decimals: 18,
      icon: "/currency/usdc.png",
      name: "USDC.e",
      symbol: "USDC.e"
    }
  },
  mainnet: {
    bettingContractAddress: ""
  }
};

export default config[import.meta.env.VITE_BERA_ENV || "testnet"];
