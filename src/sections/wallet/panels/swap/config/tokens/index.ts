import { DEFAULT_CHAIN_ID } from "..";
import { bera, CHAIN_ID as beraChainId } from "./bera";
import { beraB, CHAIN_ID as beraBChainId } from "./bera-bArtio";

const getTokens = (chainId: number) => {
  if (chainId === beraChainId) {
    return bera;
  }
  if (chainId === beraBChainId) {
    return beraB;
  }
};

export default {
  bera: getTokens(DEFAULT_CHAIN_ID),
};
