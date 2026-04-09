import { useState } from 'react'
import useToast from '@/hooks/use-toast'
import reportHash from '@/utils/report-hash'
import { useAuth } from '@/contexts/wallet'
import { planNearBidKeyAndReplace, nearBidAdapterDepositAmountMicro } from '@/libs/near/bid'
import {
  executeBidSignAndTransfer,
  batchWithdrawByAk,
} from '@/contexts/wallet/near/adapter-contract'
import { useContractConfigStore } from '@/stores/use-contract-config'
import { useNearKeyStore } from '@/stores/use-near-key'
import { QUOTE_TOKEN } from '@/config/btc'
import { computeWithdrawTokenIdsFromAccount } from '@/libs/near/internal-balances'
import { getUserId, viewMethod, allReceiptsSucceeded, type IFinalExecutionOutcome } from './util'

type NearAdapterTxResult = {
  status?: string
  successResult?: IFinalExecutionOutcome[]
  errorResult?: { message?: string }
} | null

/**
 * NEAR internal balance claim only: after optional replace-AK (`handleClaim`),
 * `runClaim` calls `batchWithdrawByAk` to move USDT / base FT from adapter `get_account`
 * to the user's NEAR `accountId` (ref-ui-v2 `useDollaClaimFlow.runClaim` / `batchWithdrawByAk` parity).
 * Does not call `refund_bet`. NEAR wallet only (`accountId` required).
 */
export default function useClaimNear(onSuccess?: () => void) {
  const [claimLoading, setClaimLoading] = useState(false)
  const toast = useToast()
  const { address, chainType, updateNearAccount, accountId } = useAuth()

  async function runClaim() {
    if (!address || !accountId) {
      return
    }

    setClaimLoading(true)
    const toastId = toast.loading({ title: 'Claiming...' })

    try {
      const user_id = getUserId(address, chainType)
      const account = await viewMethod({
        method: 'get_account',
        args: { user_id },
      })
      const tokenAddresses = computeWithdrawTokenIdsFromAccount(account)

      if (tokenAddresses.length === 0) {
        toast.dismiss(toastId)
        toast.info({ title: 'No internal balance to claim' })
        return
      }

      const { publicKey: storedPk, privateKey: storedSk } = useNearKeyStore.getState()
      if (!storedPk || !storedSk) {
        toast.dismiss(toastId)
        toast.fail({ title: 'Wallet keys not ready' })
        return
      }

      const result = await batchWithdrawByAk(
        { recipientAccount: accountId, tokenAddresses },
        { publicKey: storedPk, privateKey: storedSk }
      )

      toast.dismiss(toastId)
      console.log(result)
      if (result.status === 'success' && result.txHash) {
        reportHash({
          hash: result.txHash,
          chain: 'near',
          user: address,
        })
        await updateNearAccount?.()
        toast.success({ title: 'Claim success' })
        onSuccess?.()
      } else {
        toast.fail({
          title: result.status === 'error' ? result.errorResult.message ?? 'Claim failed' : 'Claim failed',
        })
      }
    } catch (error) {
      toast.dismiss(toastId)
      toast.fail({ title: 'Claim failed' })
      console.error('runClaim error:', error)
    } finally {
      setClaimLoading(false)
    }
  }

  async function handleClaim() {
    if (!address || !accountId) {
      return
    }

    setClaimLoading(true)

    const bidFlowContext: {
      messagesToSign: string[]
      needReplaceAk: boolean
      replaceAkPayloadString: string
      publicKey: string
      privateKey: string
    } = {
      messagesToSign: [],
      needReplaceAk: false,
      replaceAkPayloadString: '',
      publicKey: '',
      privateKey: '',
    }

    try {
      const plan = await planNearBidKeyAndReplace(address, chainType)

      if (plan.needReplaceAk && plan.replaceAkPayloadString) {
        bidFlowContext.messagesToSign.push(plan.replaceAkPayloadString)
        bidFlowContext.needReplaceAk = true
        bidFlowContext.replaceAkPayloadString = plan.replaceAkPayloadString
        bidFlowContext.publicKey = plan.publicKey
        bidFlowContext.privateKey = plan.privateKey
      }

      if (bidFlowContext.messagesToSign.length > 0) {
        const contractConfig = useContractConfigStore.getState().config
        const changeAkFee = Number(contractConfig?.change_ak_fee ?? 0)
        const depositAmount = nearBidAdapterDepositAmountMicro(0, 0, changeAkFee, true)

        const txResult = (await executeBidSignAndTransfer({
          messages: [...bidFlowContext.messagesToSign],
          transferParams: {
            tokenId: QUOTE_TOKEN.address,
            amount: depositAmount,
            operationKey: bidFlowContext.publicKey,
          },
        })) as NearAdapterTxResult

        if (
          !txResult ||
          txResult.status !== 'success' ||
          !txResult.successResult ||
          !allReceiptsSucceeded(txResult.successResult)
        ) {
          toast.fail({
            title: txResult?.errorResult?.message ?? 'Update access key failed',
          })
          return
        }

        useNearKeyStore.getState().set({
          publicKey: bidFlowContext.publicKey,
          privateKey: bidFlowContext.privateKey,
        })
        await updateNearAccount?.()
      }

      await runClaim()
    } catch (error) {
      toast.fail({ title: 'Claim failed' })
      console.error('handleClaim error:', error)
    } finally {
      setClaimLoading(false)
    }
  }

  return {
    handleClaim,
    runClaim,
    claim: handleClaim,
    refund: handleClaim,
    claimLoading,
    loading: claimLoading,
    setClaimLoading,
  }
}
