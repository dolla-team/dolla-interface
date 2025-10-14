/// <reference types="vite/client" />

import { Howl } from "howler";

declare global {
  interface Window {
    howl: {
      flip: Howl;
      bgm: Howl;
    };
    drawsUpdateTimer: NodeJS.Timeout;
    poolTimer: NodeJS.Timeout;
    winnerTimer: NodeJS.Timeout;
    cachedPoolId: number;
    scrollTimer: NodeJS.Timeout;
    bidDataTimer: NodeJS.Timeout | number;
    bidResultTimer: NodeJS.Timeout | number;
    lastBidTimer: NodeJS.Timeout | number;
    accountTimer: NodeJS.Timeout | number;
    autoFlipTimer: NodeJS.Timeout | number;
    joinMarketTimer: NodeJS.Timeout | number;
    createMarketTimer: NodeJS.Timeout | number;
    oddOffset: number;
  }
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

export {};
