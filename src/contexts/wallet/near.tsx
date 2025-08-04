import {
  NetworkId,
  setupWalletSelector,
  WalletSelector
} from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import nearChainConfig from "@/config/near";

interface NearWalletContextType {
  accountId: string | null;
  selector: WalletSelector | null;
  modal: any;
  connectWallet: () => void;
  disconnectWallet: () => void;
  loading: boolean;
}

const NearWalletContext = createContext<NearWalletContextType | undefined>(
  undefined
);

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const selectorRef = useRef<WalletSelector | null>(null);
  const modalRef = useRef<any>(null);

  const initNearWallet = async () => {
    try {
      setLoading(true);
      const networkId = nearChainConfig.networkId || "testnet";
      const contractId = nearChainConfig.contractAddress;

      console.log("Initializing NEAR wallet", {
        networkId,
        contractId,
        env: import.meta.env
      });

      const selector = await setupWalletSelector({
        network: networkId as NetworkId,
        debug: true, // Enable debug mode
        modules: [setupMyNearWallet(), setupMeteorWallet(), setupHereWallet()]
      });

      console.log("Wallet selector created", selector);

      // Subscribe to account changes - simplified version without RxJS operators
      const subscription = selector.store.observable.subscribe((state: any) => {
        console.log("Wallet state change", state);
        setAccountId(state.accounts[0]?.accountId || null);
      });

      if (!contractId) {
        console.warn("No contract ID provided");
      }

      modalRef.current = setupModal(selector, {
        contractId: contractId || ""
      });

      console.log("Modal created", modalRef.current);

      selectorRef.current = selector;

      // Return cleanup function
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Failed to initialize NEAR wallet:", error);
      return () => {}; // Return noop cleanup function in case of error
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = () => {
    console.log("connectWallet called", {
      modal: modalRef.current,
      loading,
      selector: selectorRef.current
    });
    if (modalRef.current) {
      console.log("Showing wallet modal");
      modalRef.current.show();
    } else {
      console.error("Modal not initialized");
    }
  };

  const disconnectWallet = async () => {
    try {
      if (selectorRef.current) {
        const wallet = await selectorRef.current.wallet();
        await wallet.signOut();
        setAccountId(null);
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  useEffect(() => {
    const cleanup = initNearWallet();
    return () => {
      cleanup.then((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, []);

  return (
    <NearWalletContext.Provider
      value={{
        accountId,
        selector: selectorRef.current,
        modal: modalRef.current,
        connectWallet,
        disconnectWallet,
        loading
      }}
    >
      {children}
    </NearWalletContext.Provider>
  );
}

export const useNearWallet = () => {
  const context = useContext(NearWalletContext);
  if (context === undefined) {
    throw new Error("useNearWallet must be used within a WalletProvider");
  }
  return context;
};
