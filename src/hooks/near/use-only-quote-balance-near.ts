import { useCallback, useEffect, useState } from 'react'
import Big from 'big.js'
import { viewContractMethod } from '@/hooks/near/util'
import { DOLLA_USDT_TOKEN_ID } from '@/contexts/wallet/near/adapter-contract'

export type NearChainOnlyQuoteAccount = {
  onlyQuoteBalance: string
}

/**
 * On-chain USDT (NEP-141) balance for a NEAR account id — same flow as
 * ref-ui-v2 refreshUsdtBalance (ft_metadata + ft_balance_of).
 * Returns human-readable onlyQuoteBalance, same shape as useAccount's onlyQuoteBalance field.
 */
export async function refreshUsdtBalance(nearAccountId: string | undefined): Promise<string> {
  if (!nearAccountId) {
    return '0'
  }
  try {
    const meta = await viewContractMethod(DOLLA_USDT_TOKEN_ID, 'ft_metadata', {})
    if (!meta) {
      return '0'
    }
    const decimals = typeof meta.decimals === 'number' ? meta.decimals : 6
    const raw = await viewContractMethod(DOLLA_USDT_TOKEN_ID, 'ft_balance_of', {
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

export default function useNearChainOnlyQuoteBalance(nearAccountId: string | undefined) {
  const [onlyQuoteBalance, setOnlyQuoteBalance] = useState('0')
  const [loading, setLoading] = useState(false)

  const refreshUsdtBalanceFn = useCallback(async () => {
    if (!nearAccountId) {
      setOnlyQuoteBalance('0')
      return
    }
    setLoading(true)
    try {
      const readable = await refreshUsdtBalance(nearAccountId)
      setOnlyQuoteBalance(readable)
    } finally {
      setLoading(false)
    }
  }, [nearAccountId])

  useEffect(() => {
    if (!nearAccountId) {
      setOnlyQuoteBalance('0')
      return
    }
    void refreshUsdtBalanceFn()
    const timer = window.setInterval(() => void refreshUsdtBalanceFn(), 10_000)
    return () => clearInterval(timer)
  }, [nearAccountId, refreshUsdtBalanceFn])

  const accountSlice: NearChainOnlyQuoteAccount = { onlyQuoteBalance }

  return {
    account: accountSlice,
    onlyQuoteBalance,
    loading,
    refreshUsdtBalance: refreshUsdtBalanceFn,
  }
}
