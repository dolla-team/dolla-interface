export default {
  mainnet: {
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.near.org",
    myNearWalletUrl: "https://app.mynearwallet.com/",
    helperUrl: "https://api.kitwallet.app",
    explorerUrl: "https://nearblocks.io",
    pikespeakUrl: "https://pikespeak.ai",
    nearExplorerUrl: "https://explorer.near.org/",
    indexerUrl: "https://mainnet-indexer.ref-finance.com",
    dataServiceApiUrl: "https://api.data-service.ref.finance",
    txIdApiUrl: "https://api3.nearblocks.io",
    REF_FI_CONTRACT_ID: "v2.ref-finance.near"
  },
  "pub-testnet": {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    myNearWalletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://testnet-api.kitwallet.app",
    explorerUrl: "https://testnet.nearblocks.io",
    pikespeakUrl: "https://pikespeak.ai",
    nearExplorerUrl: "https://explorer.testnet.near.org/",
    indexerUrl: "https://testnet-indexer.ref-finance.com",
    dataServiceApiUrl: "https://api.data-service.ref.finance",
    txIdApiUrl: "https://api-testnet.nearblocks.io",
    REF_FI_CONTRACT_ID: "ref-finance-101.testnet"
  },
  testnet: {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    myNearWalletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://testnet-api.kitwallet.app",
    explorerUrl: "https://testnet.nearblocks.io",
    pikespeakUrl: "https://pikespeak.ai",
    nearExplorerUrl: "https://explorer.testnet.near.org/",
    indexerUrl: "https://dev-indexer.ref-finance.com",
    dataServiceApiUrl: "https://dev.data-service.ref-finance.com",
    txIdApiUrl: "https://api-testnet.nearblocks.io",
    REF_FI_CONTRACT_ID: "exchange.ref-dev.testnet"
  }
} as Record<string, any>;
