/// <reference types="vite/client" />

import { Howl } from "howler";

declare global {
  interface Window {
    howl: {
      flip: Howl;
    };
    drawsUpdateTimer: NodeJS.Timeout;
    poolTimer: NodeJS.Timeout;
    winnerTimer: NodeJS.Timeout;
  }
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_LEANCLOUD_APP_ID: string;
  readonly VITE_LEANCLOUD_APP_KEY: string;
  readonly VITE_LEANCLOUD_SERVER_URL: string;
  readonly VITE_LEANCLOUD_ROOM_ID: string;
  readonly VITE_SOLANA_OPERATOR: string;
  readonly VITE_SOLANA_RPC_URL: string;
  readonly VITE_SOLANA_CLUSTER_NAME: string;
  readonly VITE_PUSHER_APP_KEY: string;
  readonly VITE_PUSHER_APP_CLUSTER: string;
  readonly VITE_SPONSOR_API_KEY: string;
  readonly VITE_NEAR_CONTRACT_ADDRESS: string;
  readonly VITE_NEAR_NETWORK_ID: string;
  readonly VITE_NEAR_NODE_URL: string;
  readonly VITE_NEAR_ENV: string;
  readonly VITE_OWNER: string;
  readonly VITE_MASTER: string;
  readonly VITE_EAM: string;
  readonly VITE_RNG: string;
  readonly VITE_BET_TOKEN: string;
  readonly VITE_PRIZE_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};