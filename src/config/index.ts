// Use relative path to avoid CORS issues in both dev and production
// export const HOST_API = import.meta.env.DEV ? "/api" : "/";

// export const HOST_API = "https://test-api.dolla.market";

export const IS_TEST =
  import.meta.env.VITE_PRIVY_APP_ID === "cmbkf9huq00tnl80lnrjj94eg";

export const HOST_API = IS_TEST
  ? "https://test-api.dolla.market"
  : "https://api.dolla.market";

export const WS_URL = IS_TEST
  ? "wss://test-ws.dolla.market/ws"
  : "wss://ws.dolla.market/ws";

export const INVATE_ACTIVE = false;

export const BET_UNIT = String(1000000);

export const NEAR_REFUND_ACCOUNT = "reffer.near";

export const EVM_REFUND_ACCOUNT = "0x1c7c07f5b03d4d73098d025e46497e93a8b8ec72";

export const SOLANA_REFUND_ACCOUNT =
  "F2Y14Sq9EfvbaUQJhkoRqzd2pxnWd4KsT3vag9WAmfCb";

export const BTC_REFUND_ACCOUNT = "3HMTBqmN7Xxi1YSZH1mzuYtjNm4pkiwzaZ";

export const TWITTER_CLIENT_ID = "NWZlaG93WlNfNW4xVmxNZHdvUVo6MTpjaQ";

export const TELEGRAM_BOT = "dolla_test_bot";
export const TELEGRAM_BOT_ID = "8234415143";

export const BTC_CREATE_FORM_URL = "https://tally.so/r/3q0QqY";

export const BID_UNITS = [1, 10, 50, 100];

export const BUY_TICKET_RECIPIENT = IS_TEST
  ? 'dbf30dc7bca13c69c9630765fa66d4a53e5f29ce' // testnet recipient
  : 'd0f9da85ca8dbc1586067c659280084036913766' // mainnet recipient
