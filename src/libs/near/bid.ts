import Big from 'big.js'
import { KeyPair } from 'near-api-js'
import { viewMethod, getUserId } from '@/hooks/near/util'
import { QUOTE_TOKEN } from '@/config/btc'
import { BET_UNIT } from '@/config'
import { useNearKeyStore } from '@/stores/use-near-key'
import axiosInstance from '@/libs/axios'

/** 24h bid payload deadline (ms). */
const BID_DEADLINE_MS = 1000 * 60 * 60 * 24
/** Replace-AK payload deadline (ms), same as use-generate-key updateAk. */
const REPLACE_AK_DEADLINE_MS = 1000 * 60 * 60 * 6
const AK_POLL_INTERVAL_MS = 1000
const AK_POLL_MAX_ATTEMPTS = 15

export type NearBidPostBody = {
  payload: string
  random_seed: string
  user_signature: string
}

export type BuildNearBidPostBodyParams = {
  poolId: number
  times: number
  address: string
  chainType: string
}

export async function getOnChainUserAk(address: string, chainType: string): Promise<string | null> {
  const user_id = getUserId(address, chainType)
  const onChainAk = await viewMethod({
    method: 'get_user_id_ak',
    args: { user_id },
  })
  return onChainAk ?? null
}

type UpdateUserAkAndWaitForSyncParams = {
  address: string
  chainType: string
  payload: string
  signature: string
  expectedPublicKey: string
}

export async function updateUserAkAndWaitForSync(
  params: UpdateUserAkAndWaitForSyncParams
): Promise<void> {
  const { address, chainType, payload, signature, expectedPublicKey } = params
  const response = await axiosInstance.put(`/api/v1/user/publickey`, {
    payload,
    signature,
  })
  if (!response || response.status < 200 || response.status >= 300) {
    throw new Error('AK_UPDATE_REQUEST_FAILED')
  }

  const expectedAk = `ed25519:${expectedPublicKey}`
  for (let attempt = 0; attempt < AK_POLL_MAX_ATTEMPTS; attempt += 1) {
    const onChainAk = await getOnChainUserAk(address, chainType)
    if (onChainAk === expectedAk) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, AK_POLL_INTERVAL_MS))
  }
  console.error('AK_UPDATE_SYNC_TIMEOUT')
  throw new Error('AK_UPDATE_SYNC_TIMEOUT')
}

/** Plan signing keys + whether adapter must replace AK (useDollaBidFlow runBidFlow parity). */
export type NearBidKeyPlan = {
  publicKey: string
  privateKey: string
  needReplaceAk: boolean
  /** JSON string for `sign_payload` when `needReplaceAk` */
  replaceAkPayloadString: string | null
}

/** Short-form keys (hex segments without `ed25519:`), same as use-generate-key. */
export function createNearKeyPairShort(): { publicKey: string; privateKey: string } {
  const kp = KeyPair.fromRandom('ed25519')
  const fullPk = kp.getPublicKey().toString()
  const shortPublicKey = fullPk.split(':')[1]
  const shortPrivateKey = kp.toString().split(':')[1]
  return { publicKey: shortPublicKey, privateKey: shortPrivateKey }
}

/**
 * Ensure keys in `useNearKeyStore`, compute `needReplaceAk` from `get_user_id_ak`,
 * and build replace-AK JSON when required (dolla ctx.needReplaceAk + replaceAkPayloadString).
 */
export async function planNearBidKeyAndReplace(
  address: string,
  chainType: string
): Promise<NearBidKeyPlan> {
  const user_id = getUserId(address, chainType)
  const { publicKey: storedPk, privateKey: storedSk, set } = useNearKeyStore.getState()

  let publicKey = storedPk as string | null
  let privateKey = storedSk as string | null

  if (!publicKey || !privateKey) {
    const created = createNearKeyPairShort()
    publicKey = created.publicKey
    privateKey = created.privateKey
    set({ publicKey, privateKey })
  }

  const onChainAk = await getOnChainUserAk(address, chainType)

  const needReplaceAk = !!(onChainAk && onChainAk !== `ed25519:${publicKey}`)

  let replaceAkPayloadString: string | null = null
  if (needReplaceAk) {
    const account = await viewMethod({
      method: 'get_account',
      args: { user_id },
    })
    const payload = {
      user_id,
      ak: publicKey,
      fee_token: { FT: QUOTE_TOKEN.address },
      gas_token: { FT: QUOTE_TOKEN.address },
      nonce: account.nonce,
      deadline: String(Date.now() + REPLACE_AK_DEADLINE_MS),
    }
    replaceAkPayloadString = JSON.stringify(payload)
  }

  return {
    publicKey,
    privateKey,
    needReplaceAk,
    replaceAkPayloadString,
  }
}

/** USDT amount (6-decimal integer string) for `ft_transfer_call`: play + optional change-AK fee. */
export function nearBidAdapterDepositAmountMicro(
  times: number,
  playGameFeeHuman: number,
  changeAkFeeHuman: number,
  needReplaceAk: boolean
): string {
  let sum = Big(times).mul(BET_UNIT).plus(Big(playGameFeeHuman).mul(1e6))
  if (needReplaceAk) {
    sum = sum.plus(Big(changeAkFeeHuman).mul(1e6))
  }
  return sum.toFixed(0)
}

export function signNearBidMessage(message: string, privateKey: string): string | null {
  try {
    const fullPrivateKey = privateKey.startsWith('ed25519:') ? privateKey : `ed25519:${privateKey}`
    const keyPair = KeyPair.fromString(fullPrivateKey as Parameters<typeof KeyPair.fromString>[0])
    const messageBuffer = Buffer.from(message)
    const signed = keyPair.sign(messageBuffer)
    return Buffer.from(signed.signature).toString('hex')
  } catch (e) {
    console.error('signNearBidMessage:', e)
    return null
  }
}

export function createNearBidRandomSeed(): string {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

/**
 * Builds `/api/v1/user/bid/data` body after adapter deposit + optional AK sync.
 * Requires store keys to match `get_user_id_ak` when chain has an AK.
 */
export async function buildNearBidPostBody(
  params: BuildNearBidPostBodyParams
): Promise<NearBidPostBody | null> {
  const { publicKey, privateKey } = useNearKeyStore.getState()
  if (!publicKey || !privateKey) {
    return null
  }

  const user_id = getUserId(params.address, params.chainType)
  const onChainAk = await getOnChainUserAk(params.address, params.chainType)
  if (onChainAk && onChainAk !== `ed25519:${publicKey}`) {
    return null
  }

  const res = await viewMethod({
    method: 'get_account',
    args: { user_id },
  })
  const random_seed = createNearBidRandomSeed()
  const payload = {
    bets: params.times,
    deadline: String(Date.now() + BID_DEADLINE_MS),
    game_id: params.poolId,
    nonce: res.nonce,
    bet_token: { FT: QUOTE_TOKEN.address },
    gas_token: { FT: QUOTE_TOKEN.address },
    user_id,
  }
  const payloadString = JSON.stringify(payload)
  const user_signature = signNearBidMessage(payloadString + random_seed, privateKey)
  if (!user_signature) return null
  return { payload: payloadString, random_seed, user_signature }
}
