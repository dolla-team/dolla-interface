const config: Record<string, any> = {
  testnet: {
    bettingContractAddress: "0x580095b0Fd186309AeDCBE333f12eB08b8f0ec83"
  },
  mainnet: {
    bettingContractAddress: "",
    host_api: "https://stg-api.dolla.market"
  }
};

export default config[import.meta.env.VITE_BERA_ENV || "testnet"];
