import { useCallback, useEffect, useState } from 'react'
import Big from 'big.js'
import { viewContractMethod } from '@/hooks/near/util'
import { BASE_TOKEN } from '@/config/btc'

export type NearChainOnlyPrizeAccount = {
  onlyPrizeBalance: string
}

export async function refreshPrizeBalance(nearAccountId: string | undefined): Promise<string> {
  if (!nearAccountId) {
    return '0'
  }
  try {
    const meta = await viewContractMethod(BASE_TOKEN.address, 'ft_metadata', {})
    if (!meta) {
      return '0'
    }
    const decimals = typeof meta.decimals === 'number' ? meta.decimals : BASE_TOKEN.decimals
    const raw = await viewContractMethod(BASE_TOKEN.address, 'ft_balance_of', {
      account_id: nearAccountId,
    })
    const rawStr = typeof raw === 'string' ? raw : String(raw ?? '0')
    return Big(rawStr)
      .div(10 ** decimals)
      .toString()
  } catch {
    return '0'
  }
}

export default function useNearChainOnlyPrizeBalance(nearAccountId: string | undefined) {
  const [onlyPrizeBalance, setOnlyPrizeBalance] = useState('0')
  const [loading, setLoading] = useState(false)

  const refreshPrizeBalanceFn = useCallback(async () => {
    if (!nearAccountId) {
      setOnlyPrizeBalance('0')
      return
    }
    setLoading(true)
    try {
      const readable = await refreshPrizeBalance(nearAccountId)
      setOnlyPrizeBalance(readable)
    } finally {
      setLoading(false)
    }
  }, [nearAccountId])

  useEffect(() => {
    if (!nearAccountId) {
      setOnlyPrizeBalance('0')
      return
    }
    void refreshPrizeBalanceFn()
    const timer = window.setInterval(() => void refreshPrizeBalanceFn(), 10_000)
    return () => clearInterval(timer)
  }, [nearAccountId, refreshPrizeBalanceFn])

  const accountSlice: NearChainOnlyPrizeAccount = { onlyPrizeBalance }

  return {
    account: accountSlice,
    onlyPrizeBalance,
    loading,
    refreshPrizeBalance: refreshPrizeBalanceFn,
  }
}
