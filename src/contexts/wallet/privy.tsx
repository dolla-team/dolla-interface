import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import useLoginStore from '@/stores/use-login'
import { useMemo } from 'react'

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const solanaConnectors = toSolanaWalletConnectors();
  const loginStore = useLoginStore()

  const loginMethods = useMemo(() => {
    if (loginStore.isX) {
      return ['twitter']
    }
    return ['email', 'google', 'twitter', 'wallet']
  }, [loginStore.isX]) 
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID as string}
      clientId={import.meta.env.VITE_PRIVY_CLIENT_ID as string}
      config={{
        appearance: {
          accentColor: '#FFC42F',
          theme: '#fff',
          showWalletLoginFirst: false,
          logo: '/logo.svg',
          walletChainType: 'ethereum-and-solana',
          loginMessage: 'Enter your email to receive a secure code',
          walletList: ['detected_ethereum_wallets', 'detected_solana_wallets'],
        },
        loginMethods: loginMethods as any,
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          showWalletUIs: true,
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}

export const useGelatoSmartWalletPrivyContext = () => {
  return {};
};
