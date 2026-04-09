import React, { useContext, useState, useCallback } from 'react'
import NearWalletProvider from './near'
import PrivyWalletProvider from './privy'
import useLoginStore from '@/stores/use-login'
import WalletsModal, { type LoginWallet } from '@/contexts/wallet/wallets-model'

type WalletContextValue = {}

const WalletContext = React.createContext<WalletContextValue | null>(null)

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [loginMethodModalOpen, setLoginMethodModalOpen] = useState(false)
  const closeLoginMethodModal = useCallback(() => {
    setLoginMethodModalOpen(false)
  }, [])
  const loginStore = useLoginStore()
  const applyLoginMethod = useCallback(
    (method: LoginWallet) => {
      loginStore.set({ wallet: method })
      setLoginMethodModalOpen(false)
    },
    [loginStore]
  )
  return (
    <WalletContext.Provider value={{}}>
      <Content walletConnector={loginStore.wallet}>
        {children}
        <WalletsModal
          open={loginMethodModalOpen}
          onClose={closeLoginMethodModal}
          onSelect={applyLoginMethod}
        />
      </Content>
    </WalletContext.Provider>
  )
}

const Content = ({
  children,
  walletConnector,
}: {
  children: React.ReactNode
  walletConnector?: LoginWallet
}) => {
  if (walletConnector === 'near') {
    return <NearWalletProvider>{children}</NearWalletProvider>
  }

  if (walletConnector === 'privy') {
    return <PrivyWalletProvider>{children}</PrivyWalletProvider>
  }

  return children
}

export function useWalletConnector() {
  const context = useContext(WalletContext)

  return context || {}
}
