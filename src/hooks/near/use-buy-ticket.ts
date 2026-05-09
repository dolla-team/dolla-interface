import { useState } from "react";
import {
  getNonce,
  getProvider,
  nearSignatureToEvmSignatureHex,
  getSignaturesFromBatchSignPayloadResult,
  allReceiptsSucceeded,
  keyPairFromStoredSecret,
  createAccessKeyTransactionSigner,
} from './util'
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import useGenerateKey from "@/hooks/near/use-generate-key";
import useToast from "@/hooks/use-toast";
import { QUOTE_TOKEN } from "@/config/btc";
import { useAuth } from '@/contexts/wallet'
import { BET_UNIT, BUY_TICKET_RECIPIENT } from '@/config'
import Big from "big.js";
import reportHash from "@/utils/report-hash";
import useLoginStore from '@/stores/use-login'
import {
  nearBidAdapterDepositAmountMicro,
  planNearBidKeyAndReplace,
  updateUserAkAndWaitForSync,
} from '@/libs/near/bid'
import {
  executeBidSignAndTransfer,
  transferToNearAdapter,
} from '@/contexts/wallet/near/adapter-contract'
import { useNearKeyStore } from '@/stores/use-near-key'
import { useContractConfigStore } from '@/stores/use-contract-config'

const THIRTY_TGAS = "300000000000000";


export default function useBuyTicket(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { generateKeyPair } = useGenerateKey();
  const { updateNearAccount, address, chainType, accountId } = useAuth()
  const toast = useToast();

  async function nearTransfer(ticket: number) {
    if (!accountId) {
      toast.fail({ title: 'Please connect your NEAR wallet' })
      return ''
    }

    const plan = await planNearBidKeyAndReplace(address, chainType)
    console.log('plan.needReplaceAk', plan.needReplaceAk)
    let txResult: any
    if (plan.needReplaceAk && plan.replaceAkPayloadString) {
      const contractConfig = useContractConfigStore.getState().config
      const depositAmount = nearBidAdapterDepositAmountMicro(
        ticket,
        0,
        Number(contractConfig?.change_ak_fee ?? 0),
        plan.needReplaceAk
      )
      txResult = await executeBidSignAndTransfer({
        messages: [plan.replaceAkPayloadString],
        transferParams: {
          tokenId: QUOTE_TOKEN.address,
          amount: depositAmount,
          operationKey: plan.publicKey,
        },
      })
    } else {
      const depositAmount = Big(ticket).mul(BET_UNIT).toFixed(0)
      txResult = await transferToNearAdapter({
        tokenId: QUOTE_TOKEN.address,
        amount: depositAmount,
        operationKey: plan.publicKey,
      })
    }

    if (
      !txResult ||
      txResult.status !== 'success' ||
      !txResult.successResult ||
      !allReceiptsSucceeded(txResult.successResult)
    ) {
      return ''
    }

    if (plan.needReplaceAk) {
      if (!plan.replaceAkPayloadString) {
        return ''
      }
      const signatures = await getSignaturesFromBatchSignPayloadResult(
        txResult.successResult[0],
        accountId
      )
      const sigEvm = nearSignatureToEvmSignatureHex(signatures[0])
      const ak_signature = sigEvm.replace(/^0x/, '')
      try {
        await updateUserAkAndWaitForSync({
          address,
          chainType,
          payload: plan.replaceAkPayloadString,
          signature: ak_signature,
          expectedPublicKey: plan.publicKey,
        })
      } catch (error) {
        toast.fail({ title: 'Update access key failed, please try again later' })
        throw error
      }
      useNearKeyStore.getState().set({ publicKey: plan.publicKey, privateKey: plan.privateKey })
    }

    await updateNearAccount()

    return {
      publicKey: plan.publicKey,
      privateKey: plan.privateKey,
    }
  }

  async function transfer(ticket: number) {
    const loginWallet = useLoginStore.getState().wallet
    let toastId = toast.loading({ title: 'Buying ticket...' })
    setLoading(true)
    let publicKey = ''
    let keyPairSigner: any = null
    if (loginWallet === 'near') {
      const result = await nearTransfer(ticket)
      if (!result) {
        toast.dismiss(toastId)
        toast.fail({ title: 'Buy ticket failed' })
        setLoading(false)
        return
      }
      publicKey = result.publicKey
      keyPairSigner = await createAccessKeyTransactionSigner(
        keyPairFromStoredSecret(result.privateKey)
      )
    } else {
      const { publicKey: _publicKey, keyPairSigner: _keyPairSigner } = await generateKeyPair()
      if (!_publicKey || !_keyPairSigner) {
        toast.dismiss(toastId)
        toast.fail({ title: 'Buy ticket failed' })
        setLoading(false)
        return
      }
      publicKey = _publicKey
      keyPairSigner = _keyPairSigner
    }
  
    try {
      const provider = getProvider()
      const { header } = await provider.block({ finality: 'final' })

      const args = {
        transfer_args: {
          ByAk: {
            amount: Big(ticket).mul(BET_UNIT).toFixed(0),
            // amount: "1000",
            token: { FT: QUOTE_TOKEN.address },
            recipient: {
              Evm: BUY_TICKET_RECIPIENT,
            },
            as_gift: false,
          },
        },
        memo: JSON.stringify({
          type: 'dolla_buy_ticket',
          address: address,
          address_chain: chainType === 'near' ? 'Evm' : chainType,
        }),
      }

      const nonce = await getNonce(publicKey)
      const publicKeyObj = PublicKey.from(publicKey)

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall('inner_transfer', args, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      )

      const [, signedTransaction] = await keyPairSigner.signTransaction(transaction)
      console.log('signedTransaction:', signedTransaction)
      const result: any = await provider.sendTransaction(signedTransaction)

      reportHash({
        hash: result.transaction.hash,
        chain: 'near',
        user: address,
      })
      if (result.status.SuccessValue) {
        toast.dismiss(toastId)
        console.log('Transfer success:', result)
        toast.success({ title: 'Buy ticket success' })
        updateNearAccount()
        onSuccess?.()
      } else {
        toast.dismiss(toastId)
        console.log('Transfer failed:', result)
        toast.fail({ title: 'Buy ticket failed' })
      }
    } catch (error) {
      toast.dismiss(toastId)
      toast.fail({ title: 'Buy ticket failed' })
      console.error('Transfer error:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    transfer,
    loading
  };
}
