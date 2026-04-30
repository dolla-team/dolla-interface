import { transactions } from 'near-api-js'
import { functionCall } from 'near-api-js/lib/transaction'
import { base_decode } from 'near-api-js/lib/utils/serialize'
import { PublicKey } from 'near-api-js/lib/utils/key_pair'
import { viewFunction, executeMultipleTransactions } from '@/libs/near'
import {
  createAccessKeyTransactionSigner,
  getNonce,
  getProvider,
  keyPairFromStoredSecret,
} from '@/hooks/near/util'
import { nearBidAdapterDepositAmountMicro } from '@/libs/near/bid'
import { useContractConfigStore } from '@/stores/use-contract-config'
import { QUOTE_TOKEN } from '@/config/btc'

const NEAR_ADAPTER_CONTRACT_ID = import.meta.env.VITE_NEAR_ADAPTER_CONTRACT_ID
const GAME_CONTRACT_ID = import.meta.env.VITE_NEAR_ACCOUNT_ID as string
const WITHDRAW_GAS = BigInt('150000000000000')
export const ONE_YOCTO_NEAR = '0.000000000000000000000001'
export const DOLLA_USDT_TOKEN_ID = 'usdt.tether-token.near'

export async function getUserId(accountId: string) {
  return viewFunction({
    contractId: NEAR_ADAPTER_CONTRACT_ID,
    methodName: 'get_user_id',
    args: { account_id: accountId },
  })
}

export async function signPayload(message: string) {
  return executeMultipleTransactions(
    [
      {
        receiverId: NEAR_ADAPTER_CONTRACT_ID,
        functionCalls: [
          {
            methodName: 'sign_payload',
            args: { message },
            gas: '100000000000000',
            amount: ONE_YOCTO_NEAR,
          },
        ],
      },
    ],
    false
  )
}

export async function batchSignPayload({ messages }: { messages: string[] }) {
  return executeMultipleTransactions(
    [
      {
        receiverId: NEAR_ADAPTER_CONTRACT_ID,
        functionCalls: messages.map(message => ({
          methodName: 'sign_payload',
          args: { message },
          gas: '100000000000000',
          amount: ONE_YOCTO_NEAR,
        })),
      },
    ],
    false
  )
}

export async function transferToNearAdapter(params: {
  tokenId: string
  amount: string
  operationKey: string
}) {
  const { tokenId, amount, operationKey } = params
  const transactions = [
    {
      receiverId: tokenId,
      functionCalls: [
        {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: NEAR_ADAPTER_CONTRACT_ID,
            amount,
            msg: JSON.stringify({
              Deposit: { operation_key: operationKey },
            }),
          },
          gas: '300000000000000',
          amount: ONE_YOCTO_NEAR,
        },
      ],
    },
  ]
  return executeMultipleTransactions(transactions, false)
}

/** Batch: one sign tx (batchSignPayload) + one transfer tx, single wallet popup. Returns successResult for receipt check and signature extraction. */
export async function executeBidSignAndTransfer(params: {
  messages: string[]
  transferParams: { tokenId: string; amount: string; operationKey: string }
}) {
  const { messages, transferParams } = params
  const { tokenId, amount, operationKey } = transferParams
  const signTx = {
    receiverId: NEAR_ADAPTER_CONTRACT_ID,
    functionCalls: messages.map(message => ({
      methodName: 'sign_payload',
      args: { message },
      gas: '100000000000000',
      amount: ONE_YOCTO_NEAR,
    })),
  }
  const transferTx = {
    receiverId: tokenId,
    functionCalls: [
      {
        methodName: 'ft_transfer_call',
        args: {
          receiver_id: NEAR_ADAPTER_CONTRACT_ID,
          amount,
          msg: JSON.stringify({
            Deposit: { operation_key: operationKey },
          }),
        },
        gas: '300000000000000',
        amount: ONE_YOCTO_NEAR,
      },
    ],
  }
  return executeMultipleTransactions([signTx, transferTx], false)
}

export async function executeCreateGameAndTransfer(params: {
  messages: string[]
  transferParams: { tokenId: string; amount: string; operationKey: string }
}) {
  const { messages, transferParams } = params
  const { tokenId, amount, operationKey } = transferParams
  const signTx = {
    receiverId: NEAR_ADAPTER_CONTRACT_ID,
    functionCalls: messages.map(message => ({
      methodName: 'sign_payload',
      args: { message },
      gas: '100000000000000',
      amount: ONE_YOCTO_NEAR,
    })),
  }
  const contractConfig = useContractConfigStore.getState().config
  const depositAmount = nearBidAdapterDepositAmountMicro(
    0,
    0,
    Number(contractConfig?.change_ak_fee ?? 0),
    true
  )
  const transferFeeTx = {
    receiverId: QUOTE_TOKEN.address,
    functionCalls: [
      {
        methodName: 'ft_transfer_call',
        args: {
          receiver_id: NEAR_ADAPTER_CONTRACT_ID,
          amount: depositAmount,
          msg: JSON.stringify({
            Deposit: { operation_key: operationKey },
          }),
        },
        gas: '300000000000000',
        amount: ONE_YOCTO_NEAR,
      },
    ],
  }
  const transferTx = {
    receiverId: tokenId,
    functionCalls: [
      {
        methodName: 'ft_transfer_call',
        args: {
          receiver_id: NEAR_ADAPTER_CONTRACT_ID,
          amount,
          msg: JSON.stringify({
            Deposit: { operation_key: operationKey },
          }),
        },
        gas: '300000000000000',
        amount: ONE_YOCTO_NEAR,
      },
    ],
  }
  return executeMultipleTransactions([signTx, transferFeeTx, transferTx], false)
}

export type BatchWithdrawParams = {
  /** NEAR account id to receive withdrawn funds */
  recipientAccount: string
  /** FT contract addresses to withdraw (e.g. USDT, nBTC); each withdraws full balance when amount is omitted */
  tokenAddresses: string[]
}

/** Signer key for local AK signing (from Dolla store). */
export type WithdrawByAkSigner = {
  /** Short ed25519 public key segment (no `ed25519:` prefix), same as `useNearKeyStore`. */
  publicKey: string
  privateKey: string
}

export type BatchWithdrawByAkResult =
  | { status: 'success'; txHashes: string[]; txHash: string }
  | { status: 'error'; errorResult: Error; txHashes: string[]; txHash?: string }

/**
 * Batch withdraw internal balances via `withdraw` / `ByAk` (ref-ui-v2 `batchWithdrawByAk` parity).
 * One transaction per token so access-key nonce advances correctly.
 */
export async function batchWithdrawByAk(
  params: BatchWithdrawParams,
  signer: WithdrawByAkSigner
): Promise<BatchWithdrawByAkResult> {
  const { recipientAccount, tokenAddresses } = params
  const { publicKey: pkShort, privateKey } = signer

  if (tokenAddresses.length === 0) {
    return { status: 'error', errorResult: new Error('No tokens to withdraw'), txHashes: [] }
  }

  try {
    const kp = keyPairFromStoredSecret(privateKey)
    const keyPairSigner = await createAccessKeyTransactionSigner(kp)
    const publicKeyObj = PublicKey.from(pkShort)
    const provider = getProvider()
    const txHashes: string[] = []

    for (const tokenAddress of tokenAddresses) {
      const { header } = await provider.block({ finality: 'final' })
      const nonce = await getNonce(pkShort)

      const withdrawArgs = {
        withdraw_args: {
          ByAk: {
            token: { FT: tokenAddress },
            recipient_account: recipientAccount,
          },
        },
      }

      const transaction = transactions.createTransaction(
        GAME_CONTRACT_ID,
        publicKeyObj,
        GAME_CONTRACT_ID,
        nonce,
        [functionCall('withdraw', withdrawArgs, WITHDRAW_GAS, BigInt(0))],
        base_decode(header.hash)
      )

      const [, signedTransaction] = await keyPairSigner.signTransaction(transaction)
      const result: any = await provider.sendTransaction(signedTransaction)

      const hash = result?.transaction?.hash as string | undefined
      if (hash) {
        txHashes.push(hash)
      }

      // Empty `SuccessValue: ""` is success (void return) but falsy — do not use `if (!SuccessValue)`.
      const st = result?.status as Record<string, unknown> | undefined
      const ok =
        !!st &&
        typeof st === 'object' &&
        !('Failure' in st) &&
        ('SuccessValue' in st || 'SuccessReceiptId' in st)
      if (!ok) {
        return {
          status: 'error',
          errorResult: new Error('Withdraw failed'),
          txHashes,
          txHash: txHashes[txHashes.length - 1],
        }
      }
    }

    const lastHash = txHashes[txHashes.length - 1] ?? ''
    return { status: 'success', txHashes, txHash: lastHash }
  } catch (e) {
    return {
      status: 'error',
      errorResult: e instanceof Error ? e : new Error(String(e)),
      txHashes: [],
    }
  }
}
