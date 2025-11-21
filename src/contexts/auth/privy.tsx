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
  usePrivy,
  useWallets,
  useUser,
  useCreateWallet
} from "@privy-io/react-auth";
// @ts-ignore
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import useSignMessage from "@/hooks/near/use-sign-message";
import { useCreateWallet as useCreateSolanaWallet } from "@privy-io/react-auth/solana";
import useConfig from "@/hooks/use-config";
import useUserInfoStore from "@/stores/use-user-info";
import { useNearKeyStore } from "@/stores/use-near-key";
import useAccount from "@/hooks/near/use-account";
import useCode from "@/hooks/airdrop/use-code";
import useCreateWhitelist from "@/hooks/user/use-create-whitelist";
import { useGlobalStore } from "@/stores/use-global";
import LoginTimeoutModal from "@/components/modal/login-timeout";

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

  const chainType = useMemo(() => {
    if (user?.wallet?.connectorType === "injected") {
      return "Evm";
    }
    if (user?.wallet?.connectorType === "solana_adapter") {
      return "solana";
    }
    return "";
  }, [user]);

  const privyEvmWallet = useMemo(() => {
    if (isLoggedOut || !user) return { address: "" };
    const privyItem = wallets.find((item) =>
      chainType === "solana"
        ? item.connectorType === "embedded"
        : item.walletClientType === user?.wallet?.walletClientType
    );
    return privyItem || { address: "" };
  }, [wallets, isLoggedOut, user, chainType]);

  const privySolanaWallet = useMemo(() => {
    if (solanaWallets.length === 0) return null;
    return solanaWallets.find((item: any) =>
      chainType === "solana"
        ? item.address === user?.wallet?.address
        : item?.standardWallet?.isPrivyWallet
    );
  }, [solanaWallets, chainType, user?.wallet]);

  const signMessage = useSignMessage({ privyEvmWallet, chainType });

  const address = useMemo(() => {
    return chainType === "solana" && user?.wallet
      ? user.wallet.address
      : privyEvmWallet?.address;
  }, [chainType, user?.wallet, privyEvmWallet]);

  const { account, fetchAccount: updateNearAccount } = useAccount(
    address,
    chainType
  );

  const {
    info: userInfo,
    loading: userInfoLoading,
    onQueryUserInfo,
    setInfo
  } = useUserInfo(address);

  const { isCreatedWhitelist } = useCreateWhitelist(userInfo?.show_email);

  useCode(userInfo);

  const { onLogin } = useLogin();

  const { run: updateAccount } = useDebounceFn(
    async () => {
      if (!address) {
        return;
      }

      const loginedAddress = JSON.parse(
        localStorage.getItem("_AK_TOKEN_") || "{}"
      ).address;

      if (address === loginedAddress) {
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
    if (!user) {
      login();
      return;
    }
    if (!privySolanaWallet?.address && chainType !== "Evm") {
      return;
    }
    try {
      const time = Date.now();
      const userId = user.id.split(":")[2];

      let message: string;

      if (chainType === "Evm") {
        message = `login dolla, address:${address.toLowerCase()}, time:${time}`;
      } else if (chainType === "solana") {
        message = `login dolla, address:${address}, time:${time}`;
      } else {
        message = `login dolla, sol_address:${privySolanaWallet?.address}, wallet_id:${userId}, time:${time}`;
      }

      let signature: string = await signMessage(message);

      onLogin({
        address: address,
        solAddress: privySolanaWallet?.address,
        signature,
        time,
        userId,
        chainType,
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

    if (user) {
      sign();
    }

    if (!privyEvmWallet?.address) {
      createPrivyWallet();
    }
    if (!privySolanaWallet?.address) {
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
  }, [address, privyLogout, wallets, solanaWallets]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (isLoggedOut) {
      return;
    }
    if (!address) {
      // login();
      return;
    }
    console.log(user?.wallet, address, globalStore.isInWhitelist);
    if (user?.wallet?.address !== address) {
      logout();
      return;
    }

    if (user && globalStore.isInWhitelist) {
      updateAccount();
    }
    clearTimeout(window.loginTimeoutTimer);
    (window as any).sign = sign;
  }, [address, ready, user, isLoggedOut, globalStore.isInWhitelist]);

  return (
    <AuthContext.Provider
      value={{
        address: address,
        userInfo,
        userInfoLoading,
        accountRefresher,
        logining,
        ready,
        user,
        nearAccount: account,
        isCreatedWhitelist,
        chainType,
        updateNearAccount,
        login,
        logout,
        onQueryUserInfo,
        signMessage
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
