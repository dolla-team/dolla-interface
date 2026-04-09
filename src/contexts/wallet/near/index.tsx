import '@near-wallet-selector/modal-ui/styles.css'

import { map, distinctUntilChanged } from 'rxjs'
import { NetworkId, setupWalletSelector } from '@near-wallet-selector/core'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import nearChainConfig from '@/config/near-chain'

export type NearWalletApi = {
  accountId: string
  selector: any
  modal: any
  login: () => void
  ready: boolean
}

const NearWalletContext = createContext<NearWalletApi | null>(null)

export default function NearWalletProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState('')
  const [nearApi, setNearApi] = useState<{ selector: any; modal: any } | null>(null)

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const config = nearChainConfig['testnet']
      const selector: any = await setupWalletSelector({
        network: {
          networkId: config.networkId as NetworkId,
          nodeUrl: config.nodeUrl,
        } as any,
        fallbackRpcUrls: [config.nodeUrl],
        debug: false,
        modules: [setupMeteorWallet()],
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

      setNearApi({ selector, modal })
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(() => {
    nearApi?.modal?.show()
  }, [nearApi])

  const value = useMemo<NearWalletApi>(
    () => ({
      accountId,
      selector: nearApi?.selector ?? null,
      modal: nearApi?.modal ?? null,
      login,
      ready: nearApi != null,
    }),
    [accountId, nearApi, login]
  )

  return <NearWalletContext.Provider value={value}>{children}</NearWalletContext.Provider>
}

export const useNearWallet = () => {
  return useContext(NearWalletContext)
}
