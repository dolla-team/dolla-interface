import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
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
  useSolanaWallets,
  useCreateWallet
} from "@privy-io/react-auth";
import { useCreateWallet as useCreateSolanaWallet } from "@privy-io/react-auth/solana";
import useConfig from "@/hooks/use-config";
import useUserInfoStore from "@/stores/use-user-info";
import { useNearKeyStore } from "@/stores/use-near-key";
import useAccount from "@/hooks/near/use-account";
import useCode from "@/hooks/airdrop/use-code";
import useCreateWhitelist from "@/hooks/user/use-create-whitelist";
import { useGlobalStore } from "@/stores/use-global";
import LoginTimeoutModal from "@/components/modal/login-timeout";
import { ethers } from "ethers";

export const AuthContext = React.createContext<any | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { logout: privyLogout, login: privyLogin, ready } = usePrivy();

  const { user } = useUser();
  const nearKeyStore = useNearKeyStore();
  const globalStore = useGlobalStore();

  useConfig();
  const { wallets } = useWallets();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { createWallet: createPrivyWallet } = useCreateWallet();
  const { createWallet: createSolanaWallet } = useCreateSolanaWallet();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const [logining, setLogining] = useState(false);
  const [accountRefresher, setAccountRefresher] = useState(-1);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const userInfoStore = useUserInfoStore();

  const privyWallet = useMemo(() => {
    if (isLoggedOut || !user || wallets.length === 0) return { address: "" };
    const privyItem = wallets.find(
      (item) => item.walletClientType === user?.wallet?.walletClientType
    );
    return privyItem || { address: "" };
  }, [wallets, isLoggedOut, user]);

  const { account, fetchAccount: updateNearAccount } = useAccount(
    privyWallet?.address
  );

  const {
    info: userInfo,
    loading: userInfoLoading,
    onQueryUserInfo,
    setInfo
  } = useUserInfo(privyWallet?.address);

  const { isCreatedWhitelist } = useCreateWhitelist(userInfo?.show_email);

  useCode(userInfo);

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

      let signature: string;

      if (
        // @ts-ignore
        privyWallet?.type === "ethereum"
      ) {
        const message = `login dolla, address:${privyWallet?.address.toLowerCase()}, time:${time}`;
        // Use MetaMask for signing
        const ethereumProvider = await (
          privyWallet as any
        ).getEthereumProvider();
        if (!ethereumProvider) {
          throw new Error("Failed to get Ethereum provider");
        }
        const provider = new ethers.providers.Web3Provider(ethereumProvider);
        const signer = provider.getSigner();
        signature = await signer.signMessage(message);
      } else {
        const message = `login dolla, sol_address:${solanaWallets[0]?.address}, wallet_id:${userId}, time:${time}`;
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
        chainType: (privyWallet as any)?.type || "",
        onSuccess: async () => {
          await onQueryUserInfo();
          setAccountRefresher(1);
          setLogining(false);
        }
      });
    } catch (error: any) {
      setLogining(false);
      // If signing fails, it might be an authentication issue, redirect to login
      if (
        error?.message?.includes("authenticated") ||
        error?.message?.includes("embedded wallet")
      ) {
        login();
      }

      if (error?.message?.includes("user rejected")) {
        setTimeout(() => {
          sign();
        }, 500);
      }
    }
  };

  const login = async () => {
    window.loginTimeoutTimer = setTimeout(() => {
      setShowTimeoutModal(true);
    }, 1000 * 60 * 1);
    if (!user) {
      setIsLoggedOut(false);
      privyLogin?.();
      return;
    }
    if (!privyWallet?.address) {
      createPrivyWallet();
    }
    if (!solanaWallets[0]?.address) {
      createSolanaWallet();
    }
  };

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
    nearKeyStore.set({ publicKey: null, privateKey: null });
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
      // login();
      return;
    }

    if (user?.wallet?.address !== privyWallet?.address) {
      logout();
      return;
    }

    if (user && globalStore.isInWhitelist) {
      updateAccount();
    }
    clearTimeout(window.loginTimeoutTimer);
    (window as any).sign = sign;
  }, [
    privyWallet?.address,
    ready,
    user,
    isLoggedOut,
    globalStore.isInWhitelist
  ]);

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
        isCreatedWhitelist,
        updateNearAccount,
        login,
        logout,
        onQueryUserInfo
      }}
    >
      {children}
      <LoginTimeoutModal
        open={showTimeoutModal}
        onClose={() => {
          setShowTimeoutModal(false);
        }}
      />
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context || {};
}
