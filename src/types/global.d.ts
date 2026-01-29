/// <reference types="vite/client" />

import { Howl } from "howler";

declare global {
  interface Window {
    howl: {
      flip: Howl
      bgm: Howl
      coinDrop: Howl
      bidSuccess: Howl
      prevAnimation: Howl
    }
    cachedPoolId: number
    isSigning: boolean
    drawsUpdateTimer: NodeJS.Timeout
    poolTimer: NodeJS.Timeout
    winnerTimer: NodeJS.Timeout
    scrollTimer: NodeJS.Timeout
    bidDataTimer: NodeJS.Timeout | number
    bidResultTimer: NodeJS.Timeout | number
    lastBidTimer: NodeJS.Timeout | number
    accountTimer: NodeJS.Timeout | number
    autoFlipTimer: NodeJS.Timeout | number
    joinMarketTimer: NodeJS.Timeout | number
    createMarketTimer: NodeJS.Timeout | number
    allMarketsTimer: NodeJS.Timeout | number
    loginTimeoutTimer: NodeJS.Timeout | number
    updateSwapHistoryTimer: NodeJS.Timeout | number
    updateLucyDrawTimer: NodeJS.Timeout | number
    bidHintsTimer: NodeJS.Timeout | number
    shineTimer: NodeJS.Timeout | number
    oddOffset: number
    Telegram: any
  }
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

export {};
