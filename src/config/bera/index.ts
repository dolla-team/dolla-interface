const config: Record<string, any> = {
  testnet: {
    bettingContractAddress: "0xE2FA738637795B355feC1B2F745e9C2b4cF2c01D"
  },
  mainnet: {
    bettingContractAddress: "",
    host_api: "https://stg-api.dolla.market"
  }
};

export default config[import.meta.env.VITE_BERA_ENV || "testnet"];
