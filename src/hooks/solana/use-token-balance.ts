import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useSolanaWallets } from "@privy-io/react-auth";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";

export default function useTokenBalance({
  address,
  decimals,
  userInfo: userInfoParam
}: any) {
  const authData = useAuth();
  const userInfo = authData?.userInfo || userInfoParam;
  const [tokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fresh, setFresh] = useState(0);
  const { wallets } = useSolanaWallets();

  const connectionRef = useRef<Connection | null>(null);

  const getBalance = async () => {
    const wallet = wallets[0];

    if (!wallet) return;

    setIsLoading(true);
    try {
      if (!connectionRef.current) {
        connectionRef.current = new Connection(
          import.meta.env.VITE_SOLANA_RPC_URL,
          {
            commitment: "confirmed" as any,
            confirmTransactionInitialTimeout: 60000
          }
        );
      }
      const connection = connectionRef.current;
      const walletPublicKey = new PublicKey(wallet.address);

      if (address === "So11111111111111111111111111111111111111112") {
        const balance = await connection.getBalance(
          walletPublicKey,
          "confirmed"
        );
        const solBalance = balance / LAMPORTS_PER_SOL;
        setTokenBalance(solBalance.toString());
      } else {
        const tokenMint = new PublicKey(address);
        const tokenAccount = getAssociatedTokenAddressSync(
          tokenMint,
          walletPublicKey
        );

        try {
          const accountInfo = await getAccount(
            connection,
            tokenAccount,
            "confirmed"
          );
          const balance = Number(accountInfo.amount) / Math.pow(10, decimals);
          console.log("balance", balance.toString());
          setTokenBalance(balance.toString());
        } catch (error) {
          setTokenBalance("0");
        }
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
    if (!address || !wallets.length || !userInfo?.user) return;
    getBalance();
  }, [address, decimals, fresh, userInfo, wallets]);

  return { tokenBalance, isError, isLoading, update };
}
