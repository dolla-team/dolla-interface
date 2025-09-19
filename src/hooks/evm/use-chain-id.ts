import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useAuth } from "@/contexts/auth";
import { berachain } from "viem/chains";

export default function useChainId() {
  const [chainId, setChainId] = useState<number | null>(null);
  const { wallets } = useWallets();
  const { address } = useAuth();

  const switchToBerachain = async (targetChainId?: number) => {
    if (!wallets.length || !address) {
      return false;
    }

    const wallet = wallets.find((item) => item.address === address);
    if (!wallet) {
      return false;
    }

    try {
      // Use Privy wallet's built-in switchChain method
      await wallet.switchChain(targetChainId ?? berachain.id);
      return true;
    } catch (error) {
      console.error("Failed to switch network:", error);
      return false;
    }
  };

  useEffect(() => {
    const getChainId = async () => {
      if (!wallets.length || !address) {
        setChainId(null);
        return;
      }

      const wallet = wallets.find((item) => item.address === address);
      if (!wallet) {
        setChainId(null);
        return;
      }

      try {
        const ethereumProvider = await wallet.getEthereumProvider();
        if (!ethereumProvider) {
          setChainId(null);
          return;
        }

        const chainId = await ethereumProvider.request({
          method: "eth_chainId"
        });

        setChainId(parseInt(chainId, 16));
      } catch (error) {
        setChainId(null);
      }
    };

    getChainId();
  }, [wallets, address]);

  return { chainId, switchToBerachain };
}
