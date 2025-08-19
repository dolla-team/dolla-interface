import { useAuth } from "@/contexts/auth";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useChainId from "./use-chain-id";

export function useAccount() {
  const [provider, setProvider] = useState<any>(null);

  const { wallet, address } = useAuth();
  const { chainId, switchToBerachain } = useChainId();

  const getProvider = async () => {
    const ethereumProvider = await wallet?.getEthereumProvider();
    const _provider = new ethers.providers.Web3Provider(ethereumProvider);
    setProvider(_provider);
  };

  useEffect(() => {
    getProvider();
  }, [wallet]);

  return {
    provider,
    chainId,
    wallet,
    account: address,
    switchToBerachain,
  };
}
