import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import useUserInfo from '@/hooks/use-user-info'
import useLogin from '@/hooks/use-login'
import useConfig from '@/hooks/use-config'
import useUserInfoStore from '@/stores/use-user-info'
import { useNearKeyStore } from '@/stores/use-near-key'
import useNearChainOnlyQuoteBalance from '@/hooks/near/use-only-quote-balance-near'
import useAccount from '@/hooks/near/use-account'
import useCode from '@/hooks/airdrop/use-code'
import useCreateWhitelist from '@/hooks/user/use-create-whitelist'
import { useGlobalStore } from '@/stores/use-global'
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
  nearDisconnect: () => Promise<void>
  ready: boolean
}

export const NearAuthProvider: React.FC<NearAuthProviderProps> = ({
  children,
  accountId,
  selector,
  nearLogin,
  nearDisconnect,
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
  // const [signMessages, setSignMessages] = useState<string[]>([])
  // const [showSignMessageBox, setShowSignMessageBox] = useState(false)

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
        const _address = raw?.Evm?.toLowerCase()
        setAddress(_address?.startsWith('0x') ? _address : '0x' + (_address ?? ''))
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

  const { account, fetchAccount: fetchNearContractAccount } = useAccount(
    address ?? '',
    NEAR_CHAIN_TYPE
  )

  const nearAccount = useMemo(() => {
    return {
      ...(account ?? {}),
      onlyQuoteBalance: chainOnlyQuoteBalance,
    }
  }, [account, chainOnlyQuoteBalance])

  const updateNearAccount = useCallback(async () => {
    await Promise.all([fetchNearContractAccount(), refreshUsdtBalance()])
  }, [fetchNearContractAccount, refreshUsdtBalance])

  const { onLogin } = useLogin()

  const signWithWallet = async (
    message: string
  ): Promise<{ signature: string; nonce: string; publicKey: string } | null> => {
    if (!selector || !accountId) {
      throw new Error('Wallet not ready')
    }
    try {
      const wallet = await selector.wallet()
      if (typeof wallet.signMessage !== 'function') {
        console.error('Wallet does not support signMessage (NEP-413)')
        return null
      }
      const recipient = 'dolla.market'
      const nonceBytes = Buffer.alloc(32)
      crypto.getRandomValues(nonceBytes)
      const signed = await wallet.signMessage({
        message,
        recipient,
        nonce: nonceBytes,
      })
      console.log('signed', signed)
      const signature = signed.signature ?? ''
      if (!signature) {
        return null
      }
      const nonce = nonceBytes.toString('base64')

      return { signature, nonce, publicKey: signed.publicKey }
    } catch (err) {
      console.error('Sign message failed', err)
      return null
    }
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
      const evmAddress = address
      const message = `login dolla, address:${evmAddress}, time:${time}`
      window.isSigning = true
      console.log('message', message)
      const signed = await signWithWallet(message)
      if (!signed) {
        throw new Error('Sign message failed')
      }

      onLogin({
        address,
        signature: signed.signature,
        nonce: signed.nonce,
        time,
        userId: evmAddress,
        chainType: NEAR_CHAIN_TYPE,
        publicKey: signed.publicKey,
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
    console.log('selector', selector, address)
    if (!address || !selector) {
      nearLogin()
      return
    }

    await sign()
  }, [address, nearLogin, selector])

  const logout = useCallback(async () => {
    try {
      await nearDisconnect()
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
    setAddress('')
    addressRef.current = ''
  }, [nearDisconnect])

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
        // signMessage,
      }}
    >
      {children}
      {/* <SignMessageBox
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
      /> */}
    </NearAuthContext.Provider>
  )
}
