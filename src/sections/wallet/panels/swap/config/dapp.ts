import { berachain, berachainTestnetbArtio } from "viem/chains";
import { bera } from "./tokens/bera";

export const dapp = {
  name: "Kodiak",
  defaultInputCurrency: bera["usdc.e"],
  defaultOutputCurrency: bera["honey"],
  tokens: {
    [berachainTestnetbArtio.id]: [
      bera["bera"],
      bera["wbera"],
      bera["weth"],
      bera["usdc.e"],
      bera["honey"],
      bera["usdt0"]
    ],
    [berachain.id]: [
      bera["bera"],
      bera["wbera"],
      bera["weth"],
      bera["usdc.e"],
      bera["honey"],
      bera["usdt0"]
    ]
  }
};

export const dexs: Record<string, any> = {
  kodiak: dapp
};
