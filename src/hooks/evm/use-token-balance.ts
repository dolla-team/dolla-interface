import { Contract, ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useWallets } from "@privy-io/react-auth";

export const TOKEN_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

export default function useTokenBalance({
  address,
  decimals,
  chainId = 80094,
  account
}: {
  address: string;
  decimals: number;
  chainId?: number;
  account?: string;
}) {
  const authData = useAuth();
  const privyAccount = authData?.address;
  const [tokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fresh, setFresh] = useState(0);
  const { wallets } = useWallets();

  const getBalance = async () => {
    const _account = account || privyAccount;
    const wallet = wallets.find((item) => item.address === _account);
    const ethereumProvider = await wallet?.getEthereumProvider();

    if (!ethereumProvider) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereumProvider);

    setIsLoading(true);
    try {
      if (
        address === "native" ||
        address === "0x0000000000000000000000000000000000000000"
      ) {
        const rawBalance = await provider.getBalance(_account);
        setTokenBalance(utils.formatEther(rawBalance));
      } else {
        const TokenContract = new Contract(address, TOKEN_ABI, provider);
        const rawBalance = await TokenContract.balanceOf(_account);

        setTokenBalance(utils.formatUnits(rawBalance, decimals).toString());
      }
    } catch (error) {
      setIsError(true);
      console.info("useTokenBalance_ERROR", error);
    } finally {
      setIsLoading(false);
    }
  };
  const update = () => {
    setFresh((n) => n + 1);
  };
  useEffect(() => {
    if (!address || !wallets.length) return;
    getBalance();
  }, [account, address, decimals, fresh, chainId, wallets]);

  return { tokenBalance, isError, isLoading, update };
}
