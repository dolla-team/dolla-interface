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
    bidTimer: NodeJS.Timeout;
  }
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

export {};
