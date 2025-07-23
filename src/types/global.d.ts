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
  readonly VITE_PRIVY_SIGNER_ID: string;
  readonly VITE_PRIVY_APP_ID: string;
  readonly VITE_PRIVY_CLIENT_ID: string;
  readonly VITE_SOLANA_OPERATOR: string;
  readonly VITE_SOLANA_RPC_URL: string;
  readonly VITE_SOLANA_CLUSTER_NAME: string;
  readonly VITE_PUSHER_APP_KEY: string;
  readonly VITE_PUSHER_APP_CLUSTER: string;
  readonly VITE_SPONSOR_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
