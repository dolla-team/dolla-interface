import '@near-wallet-selector/modal-ui/styles.css'

import { map, distinctUntilChanged } from 'rxjs'
import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupHotWallet } from '@near-wallet-selector/hot-wallet'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupOKXWallet } from '@near-wallet-selector/okx-wallet'
import { useCallback, useEffect, useState } from 'react'
import nearChainConfig from '@/config/near-chain'
import { NearAuthProvider } from './auth'

export type NearWalletApi = {
  accountId: string
  selector: any
  modal: any
  login: () => void
  ready: boolean
}

export default function NearWalletProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState('')
  const [nearApi, setNearApi] = useState<{ selector: any; modal: any } | null>(null)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const config = nearChainConfig['mainnet']
      const selector: any = await setupWalletSelector({
        network: {
          networkId: config.networkId as NetworkId,
          nodeUrl: config.nodeUrl,
        } as any,
        fallbackRpcUrls: [config.nodeUrl],
        debug: false,
        modules: [setupMeteorWallet(), setupHotWallet(), setupOKXWallet(), setupMyNearWallet()],
      })
      if (cancelled) return

      const { observable }: { observable: any } = selector.store
      observable
        .pipe(
          map((s: any) => s.accounts),
          distinctUntilChanged()
        )
        .subscribe((nextAccounts: any) => {
          setAccountId(nextAccounts[0]?.accountId ?? '')
        })

      const contractId = (import.meta.env.VITE_NEAR_ACCOUNT_ID as string) || 'YOUR_CONTRACT.testnet'
      const modal = setupModal(selector, { contractId })

      window.selector = selector
      setNearApi({ selector, modal })
    }

    void init()

    return () => {
      cancelled = true
      window.selector = undefined
    }
  }, [])

  const login = useCallback(() => {
    nearApi?.modal?.show()
  }, [nearApi])

  return (
    <NearAuthProvider
      accountId={accountId}
      selector={nearApi?.selector ?? null}
      nearLogin={login}
      ready={nearApi != null}
    >
      {children}
    </NearAuthProvider>
  )
}

