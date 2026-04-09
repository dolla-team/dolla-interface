import { keyStores, utils, connect } from 'near-api-js'
import type {
  FinalExecutionOutcome,
  Transaction as WSTransaction,
  Wallet,
} from '@near-wallet-selector/core'
import BN from 'bn.js'

export type NearBatchFunctionCall = {
  methodName: string
  args?: object
  gas?: string
  amount?: string
}

export type NearBatchTransaction = {
  receiverId: string
  functionCalls: NearBatchFunctionCall[]
}

export type IExecutionResult = {
  status: 'success' | 'error'
  txHashes?: string
  txHasheArr?: string[]
  txHash?: string
  successResult?: unknown
  errorResult?: Error
}

/** Query key for tx hashes after Wallet Selector redirect (ref-ui parity). */
export enum TRANSACTION_WALLET_TYPE {
  WalletSelector = 'transactionHashesWallets',
}

/** Wallets that complete signing via redirect; skip in-app hash handling. */
export const webWalletIds: string[] = []

export function addQueryParams(baseUrl: string, queryParams: Record<string, string>): string {
  const url = new URL(baseUrl)
  for (const key in queryParams) {
    const param = queryParams[key]
    if (param) url.searchParams.set(key, param)
  }
  return url.toString()
}

function ledgerTipTrigger(): void {}
function ledgerTipClose(): void {}

export async function getCurrentWallet(): Promise<Wallet> {
  const selector = window.selector
  if (!selector) {
    throw new Error('NEAR wallet selector is not initialized')
  }
  return await selector.wallet()
}

function getNearSignerId(): string {
  return window.selector?.store?.getState()?.accounts?.[0]?.accountId ?? ''
}

const config = {
  networkId: 'mainnet',
  nodeUrl: import.meta.env.VITE_NEAR_RPC_URL,
  walletUrl: 'https://wallet.near.org',
  myNearWalletUrl: 'https://app.mynearwallet.com/',
  helperUrl: 'https://api.kitwallet.app',
  explorerUrl: 'https://nearblocks.io',
  pikespeakUrl: 'https://pikespeak.ai',
  nearExplorerUrl: 'https://explorer.near.org/',
  indexerUrl: 'https://indexer.preprd.ref-finance.com',
  dataServiceApiUrl: 'https://apidata.rhea.finance',
  txIdApiUrl: 'https://api3.nearblocks.io',
}

export async function getNear() {
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const nearConnection = await connect({ keyStore, ...config })
  return nearConnection
}

export async function getAccount(accountId?: string) {
  const nearConnection = await getNear()
  const account = await nearConnection.account(accountId || '')
  return account
}

export async function viewFunction(viewArg: {
  contractId: string
  methodName: string
  args?: object
}) {
  const account = await getAccount()
  return await account.viewFunction(viewArg)
}

export const getGas = (gas?: string) => (gas ? new BN(gas) : new BN('100000000000000'))

export function getSelectedWalletId(): string {
  return window.selector?.store?.getState()?.selectedWalletId ?? ''
}

export const executeMultipleTransactions = async (
  transactions: NearBatchTransaction[],
  reloadAfterTransaction = true,
  callbackUrl?: string
) => {
  const signerId = getNearSignerId()
  if (!signerId) {
    throw new Error('No NEAR account signed in')
  }

  const wstransactions: WSTransaction[] = []

  transactions.forEach(transaction => {
    wstransactions.push({
      signerId,
      receiverId: transaction.receiverId,
      actions: transaction.functionCalls.map(fc => {
        return {
          type: 'FunctionCall',
          params: {
            methodName: fc.methodName,
            args: fc.args || {},
            gas: getGas(fc.gas).toNumber().toFixed(),
            deposit: utils.format.parseNearAmount(fc.amount || '0')!,
          },
        }
      }),
    })
  })
  const selectedWalletId = getSelectedWalletId()
  ledgerTipTrigger()
  return (await getCurrentWallet())
    .signAndSendTransactions({
      transactions: wstransactions,
      callbackUrl,
    })
    .then((res: FinalExecutionOutcome[] | void) => {
      if (webWalletIds.includes(selectedWalletId)) return
      if (!res)
        return {
          status: 'error',
          errorResult: new Error('The transaction succeeded but did not return the tx'),
        } as IExecutionResult
      const transactionHashes = (Array.isArray(res) ? res : [res])?.map(r => r.transaction.hash)
      const parsedTransactionHashes = transactionHashes?.join(',')
      const newHref = addQueryParams(window.location.origin + window.location.pathname, {
        [TRANSACTION_WALLET_TYPE.WalletSelector]: parsedTransactionHashes,
      })
      if (!reloadAfterTransaction) {
        return {
          status: 'success',
          txHashes: parsedTransactionHashes,
          txHasheArr: transactionHashes,
          txHash: transactionHashes[transactionHashes.length - 1],
          successResult: res,
        } as IExecutionResult
      }
      if (!webWalletIds.includes(selectedWalletId)) {
        window.location.href = newHref
      }
    })
    .catch((e: Error) => {
      if (webWalletIds.includes(selectedWalletId)) return
      if (!reloadAfterTransaction)
        return {
          status: 'error',
          errorResult: e,
        } as IExecutionResult
      if (!webWalletIds.includes(selectedWalletId)) {
        window.location.reload()
      }
    })
    .finally(() => {
      ledgerTipClose()
    })
}
