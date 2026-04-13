import { NearConnector } from '@hot-labs/near-connect'
import { useCallback, useEffect, useRef, useState } from 'react'
import nearChainConfig from '@/config/near-chain'
import { NearAuthProvider } from './auth'

export type NearWalletApi = {
  accountId: string
  selector: NearSelectorLike | null
  login: () => void
  ready: boolean
}

type SelectorState = {
  accounts: { accountId: string; publicKey?: string }[]
  selectedWalletId: string
}

export type NearSelectorLike = {
  wallet: () => ReturnType<NearConnector['wallet']>
  store: { getState: () => SelectorState }
}

function createNearSelectorLike(
  connector: NearConnector,
  getState: () => SelectorState
): NearSelectorLike {
  return {
    wallet: () => connector.wallet(),
    store: {
      getState,
    },
  }
}

export default function NearWalletProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState('')
  const [nearApi, setNearApi] = useState<{ selector: NearSelectorLike } | null>(null)
  const connectorRef = useRef<NearConnector | null>(null)
  const disconnectNearRef = useRef<(() => Promise<void>) | null>(null)

  const disconnectNear = useCallback(async () => {
    await disconnectNearRef.current?.()
  }, [])

  useEffect(() => {
    let cancelled = false

    const config = nearChainConfig['mainnet']
    const networkId = config.networkId as 'mainnet' | 'testnet'
    const selectorState: SelectorState = { accounts: [], selectedWalletId: '' }

    const getState = () => ({
      accounts: selectorState.accounts,
      selectedWalletId: selectorState.selectedWalletId,
    })

    const syncFromConnector = async (c: NearConnector) => {
      try {
        const { wallet, accounts } = await c.getConnectedWallet()
        selectorState.accounts = accounts.map(a => ({
          accountId: a.accountId,
          publicKey: a.publicKey,
        }))
        selectorState.selectedWalletId = wallet.manifest.id
        if (!cancelled) {
          setAccountId(accounts[0]?.accountId ?? '')
        }
      } catch {
        selectorState.accounts = []
        selectorState.selectedWalletId = ''
        if (!cancelled) {
          setAccountId('')
        }
      }
    }

    const connector = new NearConnector({
      network: networkId,
      autoConnect: false,
      footerBranding: null,
      providers: {
        mainnet: [config.nodeUrl],
      },
      features: {
        signMessage: true,
        signAndSendTransaction: true,
        signAndSendTransactions: true,
        signInWithoutAddKey: true,
      },
    })

    connectorRef.current = connector

    const onSignIn = (evt: {
      wallet: { manifest: { id: string } }
      accounts: { accountId: string; publicKey?: string }[]
    }) => {
      selectorState.accounts = evt.accounts.map(a => ({
        accountId: a.accountId,
        publicKey: a.publicKey,
      }))
      selectorState.selectedWalletId = evt.wallet.manifest.id
      if (!cancelled) {
        setAccountId(evt.accounts[0]?.accountId ?? '')
      }
    }

    const onSignOut = () => {
      selectorState.accounts = []
      selectorState.selectedWalletId = ''
      if (!cancelled) {
        setAccountId('')
      }
    }

    disconnectNearRef.current = async () => {
      try {
        await connector.disconnect()
      } catch {
        try {
          const storage = (connector as unknown as { storage: { remove: (key: string) => Promise<void> } })
            .storage
          await storage.remove('selected-wallet')
        } catch {
          /* ignore */
        }
        onSignOut()
      }
    }

    void connector.whenManifestLoaded
      .then(async () => {
        if (cancelled) return
        const selector = createNearSelectorLike(connector, getState)
        window.selector = selector
        connector.on('wallet:signIn', onSignIn)
        connector.on('wallet:signOut', onSignOut)
        await syncFromConnector(connector)
        if (!cancelled) {
          setNearApi({ selector })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNearApi(null)
        }
      })

    return () => {
      cancelled = true
      disconnectNearRef.current = null
      connector.off('wallet:signIn', onSignIn)
      connector.off('wallet:signOut', onSignOut)
      connectorRef.current = null
      window.selector = undefined
    }
  }, [])

  const login = () => {
    void connectorRef.current?.connect().catch(() => {
      // User may reject the wallet picker; ignore.
    })
  }



  return (
    <NearAuthProvider
      accountId={accountId}
      selector={nearApi?.selector ?? null}
      nearLogin={login}
      nearDisconnect={disconnectNear}
      ready={nearApi != null}
    >
      {children}
    </NearAuthProvider>
  )
}
