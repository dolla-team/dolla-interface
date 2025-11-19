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
  useCreateWallet
} from "@privy-io/react-auth";
// @ts-ignore
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";

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

  const [privySolanaWallet] = useMemo(() => {
    if (solanaWallets.length === 0) return [null];
    return [
      solanaWallets.find((item: any) =>
        chainType === "solana"
          ? item.address === user?.wallet?.address
          : item?.standardWallet?.isPrivyWallet
      )
    ];
  }, [solanaWallets, chainType, user?.wallet]);

  const address = useMemo(() => {
    return chainType === "solana" && user?.wallet
      ? user.wallet.address
      : privyEvmWallet?.address;
  }, [chainType, user?.wallet]);

  const { account, fetchAccount: updateNearAccount } = useAccount(address);

  const {
    info: userInfo,
    loading: userInfoLoading,
    onQueryUserInfo,
    setInfo
  } = useUserInfo(address);

  const { isCreatedWhitelist } = useCreateWhitelist(userInfo?.show_email);

  useCode(userInfo);

  const { signMessage } = useSignMessage();
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
    if (!address || !user) {
      login();
      return;
    }

    if (!privySolanaWallet?.address && chainType !== "Evm") {
      return;
    }
    try {
      const time = Date.now();
      const userId = user.id.split(":")[2];

      let signature: string;
      let message: string;

      if (chainType === "Evm") {
        message = `login dolla, address:${address.toLowerCase()}, time:${time}`;
        // Use MetaMask for signing
        const ethereumProvider = await (
          privyEvmWallet as any
        ).getEthereumProvider();
        if (!ethereumProvider) {
          throw new Error("Failed to get Ethereum provider");
        }
        const provider = new ethers.providers.Web3Provider(ethereumProvider);
        const signer = provider.getSigner();
        signature = await signer.signMessage(message);
      } else if (chainType === "solana") {
        const message = `login dolla, address:${address}, time:${time}`;
        // const message = `login dolla, address:E4APdiYDj6W58tsfSgYbxu6GfckvZ4SQBDbDGobh3YEt, time:1763545168104`;

        // Convert message to Buffer for Solana signing (signMessage expects Buffer)
        const encodedMessage = new TextEncoder().encode(message);

        // Sign message with Solana wallet

        const signResult = await (window as any).solana?.signMessage(
          encodedMessage
        );

        // Handle different signature formats
        // Privy Solana wallet may return signature as Uint8Array or base58 string
        if (typeof signResult === "string") {
          signature = signResult;
        } else if (signResult?.signature) {
          // If it's an object with signature property
          const sig = signResult.signature;
          signature =
            typeof sig === "string" ? sig : Buffer.from(sig).toString("base64");
        } else if (signResult instanceof Uint8Array) {
          // Convert Uint8Array to base64 string
          signature = Buffer.from(signResult).toString("base64");
        } else {
          throw new Error("Unexpected signature format from Solana wallet");
        }
        console.log(190, message, signature);
      } else {
        const message = `login dolla, sol_address:${privySolanaWallet?.address}, wallet_id:${userId}, time:${time}`;
        // Use Privy embedded wallet for signing
        const { signature: privySignature } = await signMessage({
          message
        });
        signature = privySignature;
      }

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
      console.log(212, error);
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
