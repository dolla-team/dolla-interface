import { map, distinctUntilChanged } from "rxjs";
import { NetworkId, setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import nearChainConfig from "@/config/near-chain";

const NearWalletContext = createContext<any>(undefined);

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [accountId, setAccountId] = useState<string>("");
  const selectorRef = useRef<any>(null);
  const modalRef = useRef<any>(null);
  const initNearWallet = async () => {
    const config = nearChainConfig[import.meta.env.VITE_NEAR_CHAIN];
    const selector: any = await setupWalletSelector({
      network: {
        networkId: config.networkId as NetworkId,
        nodeUrl: config.nodeUrl
      } as any,
      fallbackRpcUrls: [config.nodeUrl],
      debug: false,
      modules: [setupMeteorWallet()]
    });
    const { observable }: { observable: any } = selector.store;
    observable
      .pipe(
        map((s: any) => s.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts: any) => {
        setAccountId(nextAccounts[0]?.accountId);
      });

    modalRef.current = setupModal(selector, {
      contractId: "YOUR_CONTRACT.testnet"
    });

    selectorRef.current = selector;
  };

  useEffect(() => {
    initNearWallet();
  }, []);

  return (
    <NearWalletContext.Provider
      value={{
        accountId,
        selector: selectorRef.current,
        modal: modalRef.current
      }}
    >
      {children}
    </NearWalletContext.Provider>
  );
}

export const useNearWallet = () => {
  return useContext(NearWalletContext);
};
