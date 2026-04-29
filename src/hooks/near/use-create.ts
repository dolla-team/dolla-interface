import { useState } from 'react'
import {
  getNonce,
  getProvider,
  nearSignatureToEvmSignatureHex,
  getSignaturesFromBatchSignPayloadResult,
  allReceiptsSucceeded,
  keyPairFromStoredSecret,
  createAccessKeyTransactionSigner,
} from './util'
import { transactions } from 'near-api-js'
import { PublicKey } from 'near-api-js/lib/utils/key_pair'
import { functionCall } from 'near-api-js/lib/transaction'
import { base_decode } from 'near-api-js/lib/utils/serialize'
import useGenerateKey from '@/hooks/near/use-generate-key'
import Big from 'big.js'
import useToast from '@/hooks/use-toast'
import { BASE_TOKEN } from '@/config/btc'
import { BET_UNIT } from '@/config'
import reportHash from '@/utils/report-hash'
import { useAuth } from '@/contexts/wallet'
import useLoginStore from '@/stores/use-login'
import { planNearBidKeyAndReplace, updateUserAkAndWaitForSync } from '@/libs/near/bid'
import {
  executeBidSignAndTransfer,
  transferToNearAdapter,
} from '@/contexts/wallet/near/adapter-contract'
import { useNearKeyStore } from '@/stores/use-near-key'

const THIRTY_TGAS = '300000000000000'

export default function useCreate(onSuccess: (id: string) => void) {
  const [loading, setLoading] = useState(false)
  const { generateKeyPair } = useGenerateKey()
  const toast = useToast()
  const { updateNearAccount, address, chainType, accountId } = useAuth()

  async function nearPrepareSigner(amount: string) {
    if (!accountId) {
      toast.fail({ title: 'Please connect your NEAR wallet' })
      return null
    }

    const plan = await planNearBidKeyAndReplace(address, chainType)
    let txResult: any
    const _amount = Big(amount)
      .mul(10 ** BASE_TOKEN.decimals)
      .toFixed(0)
    if (plan.needReplaceAk && plan.replaceAkPayloadString) {
      txResult = await executeBidSignAndTransfer({
        messages: [plan.replaceAkPayloadString],
        transferParams: {
          tokenId: BASE_TOKEN.address,
          amount: _amount,
          operationKey: plan.publicKey,
        },
      })
    } else {
      txResult = await transferToNearAdapter({
        tokenId: BASE_TOKEN.address,
        amount: _amount,
        operationKey: plan.publicKey,
      })
    }

    if (
      !txResult ||
      txResult.status !== 'success' ||
      !txResult.successResult ||
      !allReceiptsSucceeded(txResult.successResult)
    ) {
      return null
    }

    if (plan.needReplaceAk) {
      if (!plan.replaceAkPayloadString) {
        return null
      }
      const signatures = await getSignaturesFromBatchSignPayloadResult(
        txResult.successResult[0],
        accountId
      )
      const sigEvm = nearSignatureToEvmSignatureHex(signatures[0])
      const akSignature = sigEvm.replace(/^0x/, '')
      try {
        await updateUserAkAndWaitForSync({
          address,
          chainType,
          payload: plan.replaceAkPayloadString,
          signature: akSignature,
          expectedPublicKey: plan.publicKey,
        })
      } catch (error) {
        toast.fail({ title: 'Update access key failed, please try again later' })
        throw error
      }
      useNearKeyStore.getState().set({
        publicKey: plan.publicKey,
        privateKey: plan.privateKey,
      })
    }

    await updateNearAccount()

    return {
      publicKey: plan.publicKey,
      keyPairSigner: await createAccessKeyTransactionSigner(
        keyPairFromStoredSecret(plan.privateKey)
      ),
    }
  }

  async function create({ amount, price }: { amount: string; price: number }) {
    try {
      const loginWallet = useLoginStore.getState().wallet
      let publicKey = ''
      let keyPairSigner: any = null
      setLoading(true)
      if (loginWallet === 'near') {
        const signerResult = await nearPrepareSigner(amount)
        if (!signerResult) {
          toast.fail({ title: 'Create failed' })
          return
        }
        publicKey = signerResult.publicKey
        keyPairSigner = signerResult.keyPairSigner
      } else {
        const signerResult = await generateKeyPair()
        if (!signerResult.publicKey || !signerResult.keyPairSigner) {
          toast.fail({ title: 'Create failed' })
          return
        }
        publicKey = signerResult.publicKey
        keyPairSigner = signerResult.keyPairSigner
      }

      const provider = getProvider()

      const { header } = await provider.block({ finality: 'final' })

      const _amount = Big(amount)
        .mul(10 ** BASE_TOKEN.decimals)
        .toFixed(0)

      const args = {
        create_args: {
          ByAk: {
            amount: _amount,
            bid_unit: BET_UNIT,
            bep: Big(amount)
              .mul(10 ** 6)
              .mul(price)
              .toFixed(0),
            prize: { FT: BASE_TOKEN.address },
          },
        },
      }

      console.log('args:', args)

      const nonce = await getNonce(publicKey)
      const publicKeyObj = PublicKey.from(publicKey)

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall('create_game', args, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      )

      const [, signedTransaction] = await keyPairSigner.signTransaction(transaction)
      console.log('signedTransaction:', signedTransaction)
      const result: any = await provider.sendTransaction(signedTransaction)
      console.log('result:', result)
      reportHash({
        hash: result.transaction.hash,
        chain: 'near',
        user: address,
      })

      if (result.status.SuccessValue) {
        toast.success({ title: 'Create success' })
        // Decode base64 to string, then parse to number
        const decodedValue = Buffer.from(result.status.SuccessValue, 'base64').toString('utf-8')
        const gameId = JSON.parse(decodedValue)
        onSuccess?.(gameId)
      } else {
        toast.fail({ title: 'Create failed' })
      }
    } catch (error) {
      console.error('Create error:', error)
      toast.fail({ title: 'Create failed' })
    } finally {
      setLoading(false)
    }
  }

  return {
    create,
    loading,
  }
}
