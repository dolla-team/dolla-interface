import axiosInstance from "@/libs/axios";
import { useAuth } from '@/contexts/wallet'
import useGenerateKey from "@/hooks/near/use-generate-key";
import { KeyPair } from "near-api-js";
import {
  viewMethod,
  getUserId,
  getSignaturesFromBatchSignPayloadResult,
  nearSignatureToEvmSignatureHex,
  allReceiptsSucceeded,
  type IFinalExecutionOutcome,
} from './util'
import { QUOTE_TOKEN } from "@/config/btc";
import useBtcDetailStore from "@/stores/use-btc-detail";
import DollaService from '@/service/kol-anysis'
import useLoginStore from '@/stores/use-login'
import {
  buildNearBidPostBody,
  nearBidAdapterDepositAmountMicro,
  planNearBidKeyAndReplace,
} from '@/libs/near/bid'
import {
  executeBidSignAndTransfer,
  transferToNearAdapter,
} from '@/contexts/wallet/near/adapter-contract'
import { useContractConfigStore } from '@/stores/use-contract-config'
import { useNearKeyStore } from '@/stores/use-near-key'


export default function useBid(
  poolId: number,
  onTxSuccess: (id: string) => void,
  onTxFail: () => void,
  onTxFail2: (msg?: string,args?: any) => void
) {
  const { address, chainType, updateNearAccount, accountId } = useAuth()
  const { generateKeyPair } = useGenerateKey();
  const btcDetailStore = useBtcDetailStore();

  // Function to sign a message using NEAR private key
  const signMessage = async (
    message: string,
    privateKey: any
  ): Promise<string | null> => {
    try {
      // Create KeyPair from private key (add ed25519: prefix if not present)
      const fullPrivateKey = privateKey.startsWith("ed25519:")
        ? privateKey
        : `ed25519:${privateKey}`;
      const keyPair = KeyPair.fromString(fullPrivateKey);

      // Convert message to buffer for signing
      const messageBuffer = Buffer.from(message);

      // Sign the message
      const signature = keyPair.sign(messageBuffer);
      console.log(
        "signature",
        Buffer.from(signature.signature).toString("hex")
      );
      // Return signature as hex string
      return Buffer.from(signature.signature).toString("hex");
    } catch (error) {
      console.error("Error signing message:", error);
      return null;
    }
  };

  const onBid = async (times: number) => {
    // onTxSuccess("800");

    // setTimeout(() => {
    //   btcDetailStore.set({
    //     bidResult: {
    //       is_winner: false,
    //       winner_point: "10,10",
    //       winner_ticket: "0,0"
    //     },
    //     flipStatus: 4
    //   });
    // }, 3000);

    // return;

    if (!address) {
      onTxFail2()
      return
    }

    const poolInfo = await viewMethod({
      method: 'get_game',
      args: { game_id: poolId },
    })
    if (poolInfo?.status !== 0) {
      let _status = 1
      if (poolInfo?.status === 1) {
        _status = 3
      } else if (poolInfo?.status === 2) {
        _status = 2
      }
      onTxFail2('pool_status_changed', { status: _status })
      return
    }

    // let toastId = toast.loading({ title: "Bidding..." });
    try {
      const loginWallet = useLoginStore.getState().wallet
      let payloadString: string
      let random_seed: string
      let signature: string | null

      if (loginWallet === 'near') {
        if (!accountId) {
          onTxFail2()
          return
        }
        const contractConfig = useContractConfigStore.getState().config
        const plan = await planNearBidKeyAndReplace(address, chainType)
        const depositAmount = nearBidAdapterDepositAmountMicro(
          times,
          Number(contractConfig?.play_game_fee ?? 0),
          Number(contractConfig?.change_ak_fee ?? 0),
          plan.needReplaceAk
        )

        type NearAdapterTxResult = {
          status?: string
          successResult?: IFinalExecutionOutcome[]
          errorResult?: { message?: string }
        } | null

        let txResult: NearAdapterTxResult
        if (plan.needReplaceAk && plan.replaceAkPayloadString) {
          txResult = (await executeBidSignAndTransfer({
            messages: [plan.replaceAkPayloadString],
            transferParams: {
              tokenId: QUOTE_TOKEN.address,
              amount: depositAmount,
              operationKey: plan.publicKey,
            },
          })) as NearAdapterTxResult
        } else {
          txResult = (await transferToNearAdapter({
            tokenId: QUOTE_TOKEN.address,
            amount: depositAmount,
            operationKey: plan.publicKey,
          })) as NearAdapterTxResult
        }

        if (
          !txResult ||
          txResult.status !== 'success' ||
          !txResult.successResult ||
          !allReceiptsSucceeded(txResult.successResult)
        ) {
          onTxFail()
          return
        }

        if (plan.needReplaceAk) {
          useNearKeyStore.getState().set({ publicKey: plan.publicKey, privateKey: plan.privateKey })
        }

        await updateNearAccount()

        const body = await buildNearBidPostBody({
          poolId,
          times,
          address,
          chainType,
        })
        if (!body) {
          onTxFail2()
          return
        }
        payloadString = body.payload
        random_seed = body.random_seed
        signature = body.user_signature
      } else {
        const { publicKey, privateKey } = await generateKeyPair()

        if (!publicKey) {
          onTxFail2()
          return
        }
        const res = await viewMethod({
          method: 'get_account',
          args: { user_id: getUserId(address, chainType) },
        })
        random_seed = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')

        const payload = {
          bets: times,
          deadline: String(Date.now() + 1000 * 60 * 60 * 24),
          game_id: poolId,
          nonce: res.nonce,
          bet_token: { FT: QUOTE_TOKEN.address },
          gas_token: { FT: QUOTE_TOKEN.address },
          user_id: getUserId(address, chainType),
        }

        payloadString = JSON.stringify(payload)
        signature = await signMessage(payloadString + random_seed, privateKey)
      }

      const response = await axiosInstance.post(`/api/v1/user/bid/data`, {
        payload: payloadString,
        random_seed,
        user_signature: signature ?? '',
      })

      console.log('response', response)

      if (!response.data.data) {
        throw new Error('Bid failed')
      }

      onTxSuccess(response.data.data)

      let count = 0

      const loopBidData = async () => {
        const result = await axiosInstance.get(
          `/api/v1/user/bid/data/detail?id=${response.data.data}`
        )
        if (result.data.data?.tx_hash) {
          btcDetailStore.set({ currentHash: result.data.data.tx_hash })
          loopBidResult(result.data.data.tx_hash)
          window.bidResultTimer = setTimeout(() => {
            console.log('bid fail timeout')
            clearTimeout(window.bidResultLoopTimer)
            DollaService.reportError({
              error_type: 'bid_failed',
              error_message: 'Failed to get bid result within 20s after receiving tx_hash',
              address: address,
              extra: result.data.data.tx_hash,
            })
            btcDetailStore.set({ currentHash: '' })
            onTxFail()
          }, 20000)
          return
        }
        if (count > 30) {
          clearTimeout(window.bidDataTimer)
          console.log('bid fail count')
          DollaService.reportError({
            error_type: 'bid_failed',
            error_message: 'Failed to get tx_hash within 30s after sending bid',
            address: address,
          })
          onTxFail()
          return
        }
        if (window.bidDataTimer) {
          clearTimeout(window.bidDataTimer)
        }
        count++
        window.bidDataTimer = setTimeout(loopBidData, 1000)
      }

      const loopBidResult = async (hash: string) => {
        const bidResponse = await axiosInstance.get(`/api/v1/user/prize/bid?hash=${hash}`)
        if (bidResponse.data.data.bid !== null && bidResponse.data.data.bid.status !== 0) {
          console.log('bidResponse', bidResponse.data.data)
          btcDetailStore.set({
            bidResult: {
              winner_point: bidResponse.data.data.point?.wild_coin_ev_result,
              winner_ticket: bidResponse.data.data.ticket?.result,
              is_winner: bidResponse.data.data.bid.is_winner,
            },
            currentHash: '',
            flipStatus: btcDetailStore.bids === 1 ? 5 : 4,
          })
          updateNearAccount()
          // bidResponse.data.data.bid.is_winner = true;
          clearTimeout(window.bidResultTimer)
          return
        }
        if (window.bidResultLoopTimer) {
          clearTimeout(window.bidResultLoopTimer)
        }
        window.bidResultLoopTimer = setTimeout(() => {
          loopBidResult(hash)
        }, 1000)
      }

      loopBidData()

      // toast.dismiss(toastId);
      // toast.success({ title: "Bid success" });
    } catch (error) {
      // toast.dismiss(toastId);
      // toast.fail({
      //   title: "Bid failed",
      //   description:
      //     error instanceof Error ? error.message : "Unknown error occurred"
      // });
      console.log('bid error', error)
      onTxFail()
    }
  };

  return {
    onBid
  };
}
