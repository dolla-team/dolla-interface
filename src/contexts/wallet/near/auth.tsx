import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import useUserInfo from '@/hooks/use-user-info'
import useLogin from '@/hooks/use-login'
import useConfig from '@/hooks/use-config'
import useUserInfoStore from '@/stores/use-user-info'
import { useNearKeyStore } from '@/stores/use-near-key'
import useNearChainOnlyQuoteBalance from '@/hooks/near/use-only-quote-balance-near'
import useCode from '@/hooks/airdrop/use-code'
import useCreateWhitelist from '@/hooks/user/use-create-whitelist'
import { useGlobalStore } from '@/stores/use-global'
import { Buffer } from 'buffer'
import { getUserId as fetchNearAdapterUserId } from './adapter-contract'
import useLoginStore from '@/stores/use-login'
import SignMessageBox from '@/libs/near/sign-message-box'

const NEAR_CHAIN_TYPE = 'near'

export const NearAuthContext = React.createContext<any | null>(null)

export type NearAuthProviderProps = {
  children: ReactNode
  accountId: string
  selector: any | null
  nearLogin: () => void
  ready: boolean
}

export const NearAuthProvider: React.FC<NearAuthProviderProps> = ({
  children,
  accountId,
  selector,
  nearLogin,
  ready,
}) => {
  useConfig()
  const nearKeyStore = useNearKeyStore()
  const globalStore = useGlobalStore()
  const userInfoStore = useUserInfoStore()
  const loginStore = useLoginStore()
  const [logining, setLogining] = useState(false)
  const [accountRefresher, setAccountRefresher] = useState(-1)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [signMessages, setSignMessages] = useState<string[]>([])
  const [showSignMessageBox, setShowSignMessageBox] = useState(false)

  const addressRef = useRef(address)
  addressRef.current = address
  const accountIdRef = useRef(accountId)
  accountIdRef.current = accountId

  useEffect(() => {
    let cancelled = false
    if (!accountId) {
      setAddress(undefined)
      return
    }
    void (async () => {
      try {
        const raw = await fetchNearAdapterUserId(accountId)

        if (cancelled) {
          return
        }
        setAddress(raw?.Evm?.toLowerCase())
      } catch (error) {
        if (!cancelled) {
          setAddress(undefined)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [accountId])

  const { loading: userInfoLoading, onQueryUserInfo } = useUserInfo(address, undefined)
  const userInfo = userInfoStore.userInfo
  const { isCreatedWhitelist } = useCreateWhitelist(undefined)
  useCode(userInfo)

  const { onlyQuoteBalance: chainOnlyQuoteBalance, refreshUsdtBalance } =
    useNearChainOnlyQuoteBalance(accountId || undefined)

  const nearAccount = useMemo(() => {
    return {
      onlyQuoteBalance: chainOnlyQuoteBalance,
    }
  }, [chainOnlyQuoteBalance])

  const updateNearAccount = useCallback(async () => {
    await refreshUsdtBalance()
  }, [refreshUsdtBalance])

  const { onLogin } = useLogin()

  const signWithWallet = useCallback(
    async (message: string) => {
      if (!selector || !accountId) {
        throw new Error('Wallet not ready')
      }
      try {
        const wallet = await selector.wallet()
        if (typeof wallet.signMessage !== 'function') {
          console.error('Wallet does not support signMessage (NEP-413)')
          return ''
        }
        const recipient = (import.meta.env.VITE_NEAR_ACCOUNT_ID as string) || ''
        const nonce = Buffer.alloc(32)
        crypto.getRandomValues(nonce)
        const signed = await wallet.signMessage({
          message,
          recipient,
          nonce,
        })

        return signed.signature ?? ''
      } catch (err) {
        console.error('Sign message failed', err)
        return ''
      }
    },
    [selector, accountId]
  )

  const signMessage = async (messages: any) => {
    setSignMessages(messages)
    setShowSignMessageBox(true)
  }

  const updateAccount = async () => {
    if (!address) {
      return
    }

    const loginedAddress = JSON.parse(localStorage.getItem('_AK_TOKEN_') || '{}').address

    if (address === loginedAddress) {
      await onQueryUserInfo()
      setAccountRefresher(1)
      return
    }

    globalStore.set({
      loginMethod: 'wallet',
    })
    setLogining(true)
    void sign()
  }

  const sign = async () => {
    if (!address || !selector) {
      setLogining(false)
      return
    }
    try {
      const time = Date.now()
      const userId = address
      const message = `login, address:${address?.startsWith('0x') ? address : '0x' + (address ?? '')}, time:${time}`
      window.isSigning = true
      console.log('message', message)
      const signature = await signWithWallet(message)
      console.log('signature', signature)
      if (!signature) {
        throw new Error('Sign message failed')
      }

      onLogin({
        address,
        signature,
        time,
        userId,
        chainType: NEAR_CHAIN_TYPE,
        onSuccess: async () => {
          await onQueryUserInfo()
          setAccountRefresher(1)
          setLogining(false)
          window.isSigning = false
        },
      })
    } catch (error: any) {
      setLogining(false)
      window.isSigning = false
      const msg = error?.message ?? ''
      if (msg.includes('user reject') || msg.includes('User rejected')) {
        setTimeout(() => void sign(), 500)
      }
    }
  }

  const login = useCallback(async () => {
    if (!address) {
      nearLogin()
      return
    }
    await sign()
  }, [address, nearLogin])

  const logout = useCallback(async () => {
    try {
      if (selector) {
        const w = await selector.wallet()
        await w.signOut()
      }
    } catch (error) {
      console.error('Error signing out NEAR wallet:', error)
    }

    localStorage.removeItem('_AK_TOKEN_')
    userInfoStore.set({ userInfo: null })
    setAccountRefresher(0)
    nearKeyStore.set({ publicKey: null, privateKey: null })
    userInfoStore.init()
    globalStore.init()
    loginStore.init()
  }, [selector])

  useEffect(() => {
    if (!ready) {
      return
    }

    if (loginStore.wallet !== 'near') {
      return
    }

    if (!accountId) {
      const loginGraceTimer = window.setTimeout(() => {
        nearLogin()
      }, 1000)
      return () => {
        clearTimeout(loginGraceTimer)
      }
    }

    if (!address) {
      return
    }

    globalStore.set({
      address,
    })
    void updateAccount()
    ;(window as any).sign = sign
  }, [ready, accountId, address, selector, loginStore.wallet])

  return (
    <NearAuthContext.Provider
      value={{
        address,
        accountId,
        userInfo,
        userInfoLoading,
        accountRefresher,
        logining,
        ready,
        nearAccount,
        isCreatedWhitelist,
        chainType: NEAR_CHAIN_TYPE,
        updateNearAccount,
        login,
        logout,
        onQueryUserInfo,
        signMessage,
      }}
    >
      {children}
      <SignMessageBox
        open={showSignMessageBox}
        onClose={() => {
          setShowSignMessageBox(false)
        }}
        messages={signMessages}
        signerAccountId={accountId || undefined}
        onSign={() => {
          return new Promise(resolve => {
            resolve(true)
          })
        }}
      />
    </NearAuthContext.Provider>
  )
}
