import { ethers } from "ethers";
import BettingContractAbi from "@/config/abis/evm-betting";
import { BETTING_CONTRACT_ADDRESS } from "@/config";
import { useWallets } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";

export default function useBettingContract(account?: string) {
  const { wallets } = useWallets();
  const [bettingContract, setBettingContract] = useState<any>(null);
  const { address: walletAddress } = useAuth();

  useEffect(() => {
    if (!wallets) {
      return;
    }
    const init = async () => {
      const wallet = wallets.find(
        // (item: any) => item.walletClientType === "metamask"
        (item: any) => item.address === (account || walletAddress)
      );
      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();

      const BettingContract = new ethers.Contract(
        BETTING_CONTRACT_ADDRESS,
        BettingContractAbi,
        signer
      );
      setBettingContract(BettingContract);
    };
    init();
  }, [wallets]);

  return bettingContract;
}
