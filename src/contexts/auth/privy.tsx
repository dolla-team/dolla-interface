import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo
} from "react";
import { useDebounceFn } from "ahooks";
import useUserInfo from "@/hooks/use-user-info";
import type { ReactNode } from "react";
import useLogin from "@/hooks/use-login";
import {
  useSignMessage,
  usePrivy,
  useWallets,
  useUser,
  useSolanaWallets
} from "@privy-io/react-auth";
import useConfig from "@/hooks/use-config";
import useUserInfoStore from "@/stores/use-user-info";
import { useNearKeyStore } from "@/stores/use-near-key";
import { ethers } from "ethers";
import useUserNft from "@/hooks/evm/use-user-nft";
import useAccount from "@/hooks/near/use-account";
import useCode from "@/hooks/airdrop/use-code";
import { useGlobalStore } from "@/stores/use-global";

export const AuthContext = React.createContext<any | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { logout: privyLogout, login: privyLogin, ready } = usePrivy();
  const { user } = useUser();
  const { setPublicKey, setPrivateKey } = useNearKeyStore();
  const globalStore = useGlobalStore();

  useConfig();
  const { wallets } = useWallets();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { getCode, bindingCode } = useCode();
  const timer = useRef<any>(0);
  const [logining, setLogining] = useState(false);
  const [accountRefresher, setAccountRefresher] = useState(-1);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const userInfoStore = useUserInfoStore();

  const privyWallet = useMemo(() => {
    if (isLoggedOut) return { address: "" };
    if (wallets.length === 0) return { address: "" };
    const privyItem = wallets.find((item) => item.walletClientType === "privy");
    return privyItem || { address: "" };
  }, [wallets, isLoggedOut]);

  const { account, fetchAccount: updateNearAccount } = useAccount(
    privyWallet?.address
  );

  const {
    info: userInfo,
    loading: userInfoLoading,
    onQueryUserInfo,
    setInfo
  } = useUserInfo(privyWallet?.address);

  useUserNft(userInfo);

  const { signMessage } = useSignMessage();
  const { onLogin } = useLogin();

  const { run: updateAccount } = useDebounceFn(
    async () => {
      if (!privyWallet?.address) {
        return;
      }

      const loginedAddress = JSON.parse(
        localStorage.getItem("_AK_TOKEN_") || "{}"
      ).address;

      if (loginedAddress) {
        getCode();
        bindingCode();
      }

      if (privyWallet?.address === loginedAddress) {
        await onQueryUserInfo();
        setAccountRefresher(1);
        return;
      }

      setLogining(true);
      sign();
    },
    { wait: 800 }
  );

  const sign = async () => {
    if (!privyWallet?.address || !user) {
      login();
      return;
    }
    if (!solanaWallets[0]?.address) {
      return;
    }
    try {
      const time = Date.now();
      const userId = user.id.split(":")[2];

      const message = `login dolla, sol_address:${solanaWallets[0]?.address}, wallet_id:${userId}, time:${time}`;
      let signature: string;

      // Choose different signing methods based on wallet type
      if (privyWallet && "walletClientType" in privyWallet) {
        // Use MetaMask for signing
        const ethereumProvider = await privyWallet.getEthereumProvider();
        if (!ethereumProvider) {
          throw new Error("Failed to get Ethereum provider");
        }
        const provider = new ethers.providers.Web3Provider(ethereumProvider);
        const signer = provider.getSigner();
        signature = await signer.signMessage(message);
      } else {
        // Use Privy embedded wallet for signing
        const { signature: privySignature } = await signMessage({
          message
        });
        signature = privySignature;
      }

      onLogin({
        address: privyWallet?.address,
        solAddress: solanaWallets[0]?.address,
        signature,
        time,
        userId,
        onSuccess: async () => {
          await onQueryUserInfo();
          setAccountRefresher(1);
          setLogining(false);
        }
      });
    } catch (error: any) {
      console.error("Sign message error:", error);
      setLogining(false);
      // If signing fails, it might be an authentication issue, redirect to login
      if (
        error?.message?.includes("authenticated") ||
        error?.message?.includes("embedded wallet")
      ) {
        login();
      }
    }
  };

  const login = useCallback(async () => {
    setIsLoggedOut(false);
    privyLogin?.();
  }, [privyLogin]);

  const logout = useCallback(async () => {
    setIsLoggedOut(true);

    try {
      for (const wallet of wallets) {
        await wallet?.disconnect();
      }

      for (const wallet of solanaWallets) {
        await wallet?.disconnect();
      }
    } catch (error) {
      console.error("Error disconnecting wallets:", error);
    }

    await privyLogout?.();

    localStorage.removeItem("_AK_TOKEN_");
    setInfo(null);
    setAccountRefresher(0);
    setPublicKey(null);
    setPrivateKey(null);
    userInfoStore.init();
    globalStore.init();
  }, [privyWallet?.address, privyLogout, wallets, solanaWallets]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (isLoggedOut) {
      return;
    }

    if (!privyWallet?.address) {
      login();
      return;
    }

    if (user) {
      updateAccount();
    }

    (window as any).sign = sign;

    clearTimeout(timer.current);

    return () => {
      clearTimeout(timer.current);
    };
  }, [privyWallet?.address, ready, user, isLoggedOut]);

  return (
    <AuthContext.Provider
      value={{
        address: privyWallet?.address,
        wallet: privyWallet,
        userInfo,
        userInfoLoading,
        accountRefresher,
        logining,
        ready,
        user,
        nearAccount: account,
        updateNearAccount,
        login,
        logout,
        onQueryUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context || {};
}
