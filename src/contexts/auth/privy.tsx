import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";
import useUserInfo from "@/hooks/use-user-info";
import type { ReactNode } from "react";
import useLogin from "@/hooks/use-login";
import {
  useLogin as usePrivyLogin,
  usePrivy,
  useWallets,
  useUser,
  useCreateWallet
} from "@privy-io/react-auth";
// @ts-ignore
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import useSignMessage from "@/hooks/near/use-sign-message";
import { useCreateWallet as useCreateSolanaWallet } from "@privy-io/react-auth/solana";
import useConfig from "@/hooks/use-config";
import useUserInfoStore from "@/stores/use-user-info";
import { useNearKeyStore } from "@/stores/use-near-key";
import useAccount from "@/hooks/near/use-account";
import useCode from "@/hooks/airdrop/use-code";
import useCreateWhitelist from "@/hooks/user/use-create-whitelist";
import { useGlobalStore } from "@/stores/use-global";
import LoginTimeoutModal from "@/components/modal/login-timeout";
import { useVerifyStore } from "@/stores/use-verify";
import { useAnalysisDataStore } from "@/stores/use-analysis-data";
import getCurrentAccount from './get-current-account'

export const AuthContext = React.createContext<any | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { logout: privyLogout, ready } = usePrivy()
  const [isCompleted, setIsCompleted] = useState(false)
  const { login: privyLogin } = usePrivyLogin({
    onComplete: async () => {
      console.log('privy login complete', wallets, user)
      setIsCompleted(true)
    },
  })
  const verifyStore = useVerifyStore()
  const analysisData = useAnalysisDataStore()
  const { user } = useUser()
  const nearKeyStore = useNearKeyStore()
  const globalStore = useGlobalStore()

  useConfig()
  const { wallets } = useWallets()

  const { wallets: solanaWallets } = useSolanaWallets()

  const { createWallet: createPrivyWallet } = useCreateWallet()
  const { createWallet: createSolanaWallet } = useCreateSolanaWallet()
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)

  const [logining, setLogining] = useState(false)
  const [accountRefresher, setAccountRefresher] = useState(-1)
  const userInfoStore = useUserInfoStore()

  const { currentAccount, solanaAccount } = useMemo(() => {
    return getCurrentAccount(user)
  }, [user])

  const [chainType, loginMethod] = useMemo(() => {
    let _loginMethod = ''
    let _chainType = ''
    if (user?.google) {
      _loginMethod = 'google'
    }
    if (user?.twitter) {
      _loginMethod = 'twitter'
    }
    if (user?.email) {
      _loginMethod = 'email'
    }

    if (currentAccount?.chainType === 'ethereum' && currentAccount?.connectorType === 'injected') {
      _chainType = 'Evm'
      _loginMethod = 'wallet'
    }
    if (
      currentAccount?.chainType === 'solana' &&
      currentAccount?.connectorType === 'solana_adapter'
    ) {
      _chainType = 'solana'
      _loginMethod = 'wallet'
    }
    return [_chainType, _loginMethod]
  }, [currentAccount])

  const privyEvmWallet = useMemo(() => {
    const privyItem = wallets?.find(item => item.address === currentAccount?.address)
    return privyItem || { address: '' }
  }, [currentAccount, wallets])

  const privySolanaWallet = useMemo(() => {
    if (solanaWallets.length === 0) return null
    return solanaWallets.find((item: any) => item.address === solanaAccount?.address)
  }, [solanaWallets, solanaAccount])

  const signMessage = useSignMessage({ privyEvmWallet, chainType })

  const address = useMemo(() => {
    return currentAccount?.address
  }, [currentAccount])

  const { account, fetchAccount: updateNearAccount } = useAccount(address, chainType)

  const { loading: userInfoLoading, onQueryUserInfo } = useUserInfo(address, user)

  const userInfo = userInfoStore.userInfo

  const { isCreatedWhitelist } = useCreateWhitelist(user)

  useCode(userInfo)

  const { onLogin } = useLogin()

  const updateAccount = async () => {
    console.log('updateAccount', address)
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
      loginMethod,
    })
    setLogining(true)
    if (!chainType) {
      console.log('no chain type, waiting 1 seconds')
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('chain type is', chainType)
    }
    sign()
  }

  const sign = async () => {
    console.log('signing', address)
    if (!user) {
      login()
      return
    }
    if (!privySolanaWallet?.address && chainType !== 'Evm') {
      return
    }
    try {
      const time = Date.now()
      const userId = user.id.split(':')[2]

      let message: string

      if (chainType === 'Evm') {
        message = `login dolla, address:${address.toLowerCase()}, time:${time}`
      } else if (chainType === 'solana') {
        message = `login dolla, address:${address}, time:${time}`
      } else if (user.twitter) {
        message = `login dolla, sol_address:${privySolanaWallet?.address}, wallet_id:${userId}, twitter: @${user.twitter.username}, time:${time}`
      } else {
        message = `login dolla, sol_address:${privySolanaWallet?.address}, wallet_id:${userId}, time:${time}`
      }
      window.isSigning = true
      console.log('message', message)
      let signature: string = await signMessage(message)
      console.log('signature', signature)

      onLogin({
        address: address,
        solAddress: privySolanaWallet?.address,
        signature,
        time,
        userId,
        chainType: chainType,
        twitterId: user.twitter?.username,
        onSuccess: async () => {
          await onQueryUserInfo()
          setAccountRefresher(1)
          setLogining(false)
          window.isSigning = false
        },
      })
    } catch (error: any) {
      setLogining(false)
      // If signing fails, it might be an authentication issue, redirect to login
      if (
        error?.message?.includes('authenticated') ||
        error?.message?.includes('embedded wallet')
      ) {
        login()
      }

      if (error?.message?.includes('user rejected')) {
        setTimeout(() => {
          sign()
        }, 500)
      }
    }
  }

  const login = async () => {
    if (!user) {
      privyLogin?.()
      return
    }

    if (user) {
      sign()
    }

    if (!privyEvmWallet?.address) {
      console.log('creating evm wallet')
      createPrivyWallet()
    }
    if (!privySolanaWallet?.address) {
      console.log('creating solana wallet')
      createSolanaWallet()
    }
  }

  const logout = useCallback(async () => {
    try {
      for (const wallet of wallets) {
        await wallet?.disconnect()
      }

      for (const wallet of solanaWallets) {
        await wallet?.disconnect()
      }
    } catch (error) {
      console.error('Error disconnecting wallets:', error)
    }

    await privyLogout?.()

    localStorage.removeItem('_AK_TOKEN_')
    userInfoStore.set({ userInfo: null })
    setAccountRefresher(0)
    nearKeyStore.set({ publicKey: null, privateKey: null })
    userInfoStore.init()
    globalStore.init()
    verifyStore.init()
    analysisData.init()
  }, [address, privyLogout, wallets, solanaWallets])

  useEffect(() => {
    if (!user) return
    if (!globalStore.isInWhitelist) {
      return
    }
    window.loginTimeoutTimer = setTimeout(
      () => {
        setShowTimeoutModal(true)
      },
      1000 * 60 * 2
    )
    if (!isCompleted) return
    clearTimeout(window.loginTimeoutTimer)
    const embeddedWallet = wallets.find(w => w.walletClientType === 'privy')
    if (!chainType && !embeddedWallet) return
    if (loginMethod === 'wallet' && !address) {
      console.log('address not equal', address, globalStore?.address)
      logout()
      return
    }
    globalStore.set({
      address,
    })
    updateAccount()
    ;(window as any).sign = sign
  }, [user, globalStore.isInWhitelist, isCompleted, wallets, chainType])

  return (
    <AuthContext.Provider
      value={{
        address: address,
        userInfo,
        userInfoLoading,
        accountRefresher,
        logining,
        ready,
        user,
        nearAccount: account,
        isCreatedWhitelist,
        chainType,
        updateNearAccount,
        login,
        logout,
        onQueryUserInfo,
        signMessage,
      }}
    >
      {children}
      <LoginTimeoutModal
        open={showTimeoutModal}
        onClose={() => {
          setShowTimeoutModal(false)
        }}
      />
    </AuthContext.Provider>
  )
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context || {};
}
