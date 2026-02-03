export default function getCurrentAccount(user: any): any {
  if (user?.linkedAccounts?.length === 0) return null
  let currentAccount = null

  user?.linkedAccounts?.forEach((item: any) => {
    if (
      (user.email || user.google || user.twitter) &&
      item.connectorType === 'embedded' &&
      item.walletClientType === 'privy'
    ) {
      currentAccount = item
    }
    if (item.chainType === 'ethereum' && item.connectorType === 'injected') {
      currentAccount = item
    }
    if (item.chainType === 'solana' && item.connectorType === 'solana_adapter') {
      currentAccount = item
    }
  })
  return currentAccount
}
