import Big from 'big.js'
import { BASE_TOKEN, QUOTE_TOKEN } from '@/config/btc'

/** Matches ref-ui-v2 `computeInternalBalances` ft/gift key shape for `get_account`. */
export function computeWithdrawTokenIdsFromAccount(account: {
  ft_tokens?: Record<string, string>
  gift_tokens?: Record<string, string>
} | null): string[] {
  if (!account?.ft_tokens && !account?.gift_tokens) {
    return []
  }
  const usdtKey = `{"FT":"${QUOTE_TOKEN.address}"}`
  const baseKey = `{"FT":"${BASE_TOKEN.address}"}`
  const usdtRaw = Big(account.ft_tokens?.[usdtKey] ?? '0').plus(account.gift_tokens?.[usdtKey] ?? '0')
  const baseRaw = Big(account.ft_tokens?.[baseKey] ?? '0').plus(account.gift_tokens?.[baseKey] ?? '0')
  const out: string[] = []
  if (usdtRaw.gt(0)) {
    out.push(QUOTE_TOKEN.address)
  }
  if (baseRaw.gt(0)) {
    out.push(BASE_TOKEN.address)
  }
  return out
}
