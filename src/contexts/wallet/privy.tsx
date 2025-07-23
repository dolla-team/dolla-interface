import {
  PrivyProvider,
  usePrivy,
  useSignAuthorization,
  useWallets
} from "@privy-io/react-auth";
import { berachain } from "viem/chains";
import { wagmi } from "@gelatonetwork/smartwallet-react-sdk";
import type { GelatoSmartAccount } from "@gelatonetwork/smartwallet/accounts";
import { http } from "wagmi";
import { createContext, useContext, useEffect, useState } from "react";
import {
  GelatoSmartWalletClient,
  createGelatoSmartWalletClient
} from "@gelatonetwork/smartwallet";
import { ChainId } from "caip";
import {
  type Account,
  type Chain,
  type Transport,
  createWalletClient,
  custom
} from "viem";
import * as chains from "viem/chains";
import { extractChain } from "viem/utils";
import { prepareAuthorization } from "viem/actions";

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID as string}
      clientId={import.meta.env.VITE_PRIVY_CLIENT_ID as string}
      config={{
        appearance: {
          accentColor: "#FFC42F",
          theme: "#1a1e24",
          showWalletLoginFirst: true,
          logo: "/logo.svg",
          walletChainType: "ethereum-and-solana",
          walletList: ["metamask"]
        },
        loginMethods: ["email"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true
          }
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true
        },
        defaultChain: berachain,
        supportedChains: [berachain],
        mfa: {
          noPromptOnMfaRequired: false
        },
        solanaClusters: [
          {
            name: import.meta.env.VITE_SOLANA_CLUSTER_NAME,
            rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL
          }
        ]
      }}
    >
      <GelatoSmartWalletPrivyInternal
        wagmi={wagmi({
          chains: [berachain],
          transports: {
            [berachain.id]: http()
          }
        })}
        apiKey={import.meta.env.VITE_SPONSOR_API_KEY}
        scw={{
          type: "gelato"
        }}
      >
        {children}
      </GelatoSmartWalletPrivyInternal>
    </PrivyProvider>
  );
}

const GelatoSmartWalletPrivyProviderContext = createContext<any>(undefined);

const GelatoSmartWalletPrivyInternal = ({
  children,
  wagmi,
  apiKey,
  scw
}: any) => {
  const { ready, authenticated, logout } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { signAuthorization } = useSignAuthorization();

  const [smartWalletClient, setSmartWalletClient] = useState<any>(null);

  const logoutWrapper = async () => {
    if (!smartWalletClient) {
      return;
    }

    setSmartWalletClient(null);
    await logout();
  };

  const switchNetwork = async (chainId: number) => {
    if (!smartWalletClient) {
      return;
    }

    const primaryWallet = wallets[0];

    await primaryWallet.switchChain(chainId);
    smartWalletClient.switchChain({ id: chainId });
  };

  useEffect(() => {
    if (!ready || !walletsReady) {
      return;
    }

    if (!authenticated || !wallets || wallets.length === 0) {
      setSmartWalletClient(null);
      return;
    }

    const fetchWalletClient = async () => {
      const primaryWallet = wallets[0];

      try {
        // Privy wallet provides chainId in CAIP2 format
        const { reference: chainId } = ChainId.parse(primaryWallet.chainId);
        const chain = extractChain({
          chains: Object.values(chains),
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          id: Number(chainId) as any
        });

        if (!chain) {
          return;
        }

        const provider = await primaryWallet.getEthereumProvider();
        const client = createWalletClient({
          account: primaryWallet.address as any,
          chain,
          transport: custom(provider)
        });

        client.signAuthorization = async (parameters) => {
          const preparedAuthorization = await prepareAuthorization(
            client,
            parameters
          );

          const signedAuthorization = await signAuthorization({
            contractAddress: preparedAuthorization.address,
            chainId: preparedAuthorization.chainId,
            nonce: preparedAuthorization.nonce
          });

          return signedAuthorization;
        };

        const walletClientGelato = await createGelatoSmartWalletClient<
          Transport,
          Chain,
          Account
          // @ts-ignore
        >(client, { apiKey, scw });

        setSmartWalletClient(walletClientGelato);
      } catch (error) {
        console.error("Failed to get wallet client:", error);
      }
    };

    fetchWalletClient();
  }, [
    ready,
    wallets,
    walletsReady,
    authenticated,
    signAuthorization,
    apiKey,
    scw
  ]);

  return (
    <GelatoSmartWalletPrivyProviderContext.Provider
      value={{
        gelato: {
          client: smartWalletClient as GelatoSmartWalletClient<
            Transport,
            Chain,
            GelatoSmartAccount
          >
        },
        wagmi: {
          config: wagmi.config
        },
        logout: logoutWrapper,
        switchNetwork
      }}
    >
      {children}
    </GelatoSmartWalletPrivyProviderContext.Provider>
  );
};

export const useGelatoSmartWalletPrivyContext = () => {
  const context = useContext(GelatoSmartWalletPrivyProviderContext);
  if (!context) {
    throw new Error(
      "useGelatoSmartWalletPrivyProvider must be used within a GelatoSmartWalletPrivyProvider"
    );
  }
  return context;
};
