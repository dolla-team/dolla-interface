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

export {};
