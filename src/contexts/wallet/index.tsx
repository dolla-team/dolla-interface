import React, { useContext } from 'react'
import NearWalletProvider from './near'
import { NearAuthContext } from './near/auth'
import PrivyWalletProvider from './privy'
import { PrivyAuthContext } from './privy/auth'
import useLoginStore from '@/stores/use-login'
import WalletsModal, { type LoginWallet } from '@/contexts/wallet/wallets-model'

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const loginStore = useLoginStore()

  return (
    <Content walletConnector={loginStore.wallet}>
      {children}
      <WalletsModal
        open={loginStore.showWalletsModal}
        onClose={() => {
          loginStore.set({ showWalletsModal: false })
        }}
        onSelect={(method: LoginWallet) => {
          loginStore.set({ wallet: method, showWalletsModal: false })
        }}
      />
    </Content>
  )
}

const Content = ({
  children,
  walletConnector,
}: {
  children: React.ReactNode
  walletConnector?: LoginWallet
}) => {
  return (
    <NearWalletProvider>
      <PrivyWalletProvider>{children}</PrivyWalletProvider>
    </NearWalletProvider>
  )
}

export function useAuth() {
  const nearContext = useContext(NearAuthContext)
  const privyContext = useContext(PrivyAuthContext)
  const loginStore = useLoginStore()

  if (loginStore.wallet === 'privy') {
    return privyContext || {}
  }

  if (loginStore.wallet === 'near') {
    return nearContext || {}
  }

  return {
    login() {
      loginStore.set({ showWalletsModal: true })
    },
  }
}
