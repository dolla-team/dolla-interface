const config: Record<string, any> = {
  devnet: {
    operator: "GZQUBKGeH4zcmQ751rnWHzDRJKAPmdRLwe2t4jxxHZPR",
    ticket_account: "9Rny1dwV3TvSvx9sxif2pdZJgFFTThg1riPNzNMVGRsP",
    dolla_contract: "2EthyEtqB67wheAFjFVFCsZBTjETGQUaMtbuEEi36VfJ",
    base_contract: "G5aHXkUgD4NnBbTZcKf7aQP2hXGw5bTVotcUc7wS8FVV",
    quote_contract: "ADo4M7ZEZwDKNP1k8dic26TBrftX6mix9sGMntkq6Tp4",
    host_api: "https://test-api.dolla.market",
    queue: "EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7"
  },
  "mainnet-beta": {
    operator: "GZQUBKGeH4zcmQ751rnWHzDRJKAPmdRLwe2t4jxxHZPR",
    ticket_account: "GZQUBKGeH4zcmQ751rnWHzDRJKAPmdRLwe2t4jxxHZPR",
    dolla_contract: "3tzKcqsc6BrFVAgyw9Jp32z18rmTh47E2rYvcabE7uNJ",
    base_contract: "4SpgfEwaxdyZRv9aKiCuk4PgLct5Eg1mGvbF7Jh8Zray",
    quote_contract: "FphwBryo4cauKUBtLQLrp2mEr5e4PZat2RMfDJCtQray",
    host_api: "https://stg-api.dolla.market",
    queue: "A43DyUGA7s8eXPxqEjJY6EBu1KKbNgfxF8h17VAHn13w"
  }
};

export default config[import.meta.env.VITE_SOLANA_CLUSTER_NAME];
