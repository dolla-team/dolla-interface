export default function getCurrentAccount(user: any): any {
  if (user?.linkedAccounts?.length === 0) return null
  let currentAccount: any = null
  let solanaAccount: any = null

  user?.linkedAccounts?.forEach((item: any) => {
    if (
      (user.email || user.google || user.twitter) &&
      item.connectorType === 'embedded' &&
      item.walletClientType === 'privy' &&
      item.chainType === 'ethereum'
    ) {
      currentAccount = item
    }
    if (item.chainType === 'ethereum' && item.connectorType === 'injected') {
      currentAccount = item
    }
    if (item.chainType === 'solana' && item.connectorType === 'solana_adapter') {
      currentAccount = item
    }
    if (item.chainType === 'solana') {
      solanaAccount = item
    }
  })
  if (currentAccount?.chainType === 'solana') {
    solanaAccount = currentAccount
  }
  return {
    currentAccount,
    solanaAccount,
  }
}
