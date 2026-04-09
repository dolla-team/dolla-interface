import { serializeNep413, verifySignature as verifyNep413Signature } from '@near-wallet-selector/core'
import { InMemorySigner } from '@near-js/signers'
import { signTransaction, Transaction } from '@near-js/transactions'
import { KeyPair, providers } from 'near-api-js'
import { KeyType, PublicKey } from 'near-api-js/lib/utils/key_pair'
import { utils } from 'ethers'

const NEAR_NETWORK_ID = 'mainnet'

/** secp256k1 curve order (n); used to try signature malleability (s vs n-s) during pubkey recovery. */
const SECP256K1_CURVE_ORDER = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')

export type Nep413SignPayload = {
  message: string
  nonce: Buffer
  recipient: string
  callbackUrl?: string
}

function nep413SignatureBase64(signed: { signature: unknown }): string | null {
  const s = signed.signature
  if (typeof s === 'string') {
    return s
  }
  if (s instanceof Uint8Array) {
    return Buffer.from(s).toString('base64')
  }
  if (Array.isArray(s)) {
    return Buffer.from(Uint8Array.from(s as number[])).toString('base64')
  }
  return null
}

function nep413SignatureBytes(signed: { signature: unknown }): Buffer | null {
  const s = signed.signature
  if (typeof s === 'string') {
    const t = s.trim()
    if (t.startsWith('0x') && /^0x[0-9a-fA-F]+$/.test(t) && (t.length === 130 || t.length === 132)) {
      return Buffer.from(t.slice(2), 'hex')
    }
    try {
      return Buffer.from(t, 'base64')
    } catch {
      return null
    }
  }
  if (s instanceof Uint8Array) {
    return Buffer.from(s)
  }
  if (Array.isArray(s)) {
    return Buffer.from(Uint8Array.from(s as number[]))
  }
  return null
}

/**
 * Finds which NEP-413 payload fields the wallet actually signed (callbackUrl often differs per wallet).
 */
function resolveVerifiedNep413Payload(
  signed: { signature: unknown; publicKey: string },
  nep413: Nep413SignPayload
): Nep413SignPayload | null {
  const sigB64 = nep413SignatureBase64(signed)
  if (!sigB64) {
    return null
  }

  const candidates: Nep413SignPayload[] = [{ ...nep413 }]
  const { callbackUrl, ...rest } = nep413
  if (callbackUrl !== undefined) {
    candidates.push({ ...rest })
  }
  if (typeof window !== 'undefined' && window.location?.href) {
    candidates.push({ ...nep413, callbackUrl: window.location.href })
  }

  const seen = new Set<string>()
  for (const params of candidates) {
    const key = `${params.message}\0${params.recipient}\0${Buffer.from(params.nonce).toString('hex')}\0${params.callbackUrl ?? ''}`
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    try {
      if (
        verifyNep413Signature({
          publicKey: signed.publicKey,
          signature: sigB64,
          message: params.message,
          nonce: params.nonce,
          recipient: params.recipient,
          callbackUrl: params.callbackUrl,
        })
      ) {
        return params
      }
    } catch {
      continue
    }
  }
  return null
}

/**
 * near-api-js v5 has no KeyPairSigner; match the old `signTransaction(tx)` helper used by hooks.
 */
export async function createAccessKeyTransactionSigner(keyPair: KeyPair) {
  const accountId = import.meta.env.VITE_NEAR_ACCOUNT_ID as string
  const signer = await InMemorySigner.fromKeyPair(NEAR_NETWORK_ID, accountId, keyPair)
  return {
    signTransaction(tx: Transaction) {
      return signTransaction(tx, signer, accountId, NEAR_NETWORK_ID)
    },
  }
}

export function keyPairFromStoredSecret(privateKey: string) {
  const full = privateKey.startsWith('ed25519:') ? privateKey : `ed25519:${privateKey}`
  return KeyPair.fromString(full as Parameters<typeof KeyPair.fromString>[0])
}

export async function quote(body: any) {
  const url = 'https://1click.chaindefuser.com/v0/quote'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    const data = await res.json()
    return data
  } else {
    throw new Error(`⚠️ Temporary Service Issue
Please wait a moment and try again — your funds are safe and will not be deducted.`)
  }
}

export function getProvider() {
  return new providers.JsonRpcProvider({
    url: import.meta.env.VITE_NEAR_RPC_URL,
  })
}

export async function viewMethod({ method, args = {} }: { method: string; args: any }) {
  const provider = getProvider()
  const res: any = await provider.query({
    request_type: 'call_function',
    account_id: import.meta.env.VITE_NEAR_ACCOUNT_ID,
    method_name: method,
    args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    finality: 'optimistic',
  })

  return JSON.parse(Buffer.from(res.result).toString())
}

/** Read-only view call on an arbitrary contract (e.g. NEP-141 ft_metadata / ft_balance_of). */
export async function viewContractMethod(
  contractId: string,
  methodName: string,
  args: Record<string, unknown> = {}
) {
  const provider = getProvider()
  const res: any = await provider.query({
    request_type: 'call_function',
    account_id: contractId,
    method_name: methodName,
    args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    finality: 'optimistic',
  })

  return JSON.parse(Buffer.from(res.result).toString())
}

export async function getNonce(publicKey: string) {
  const provider = getProvider()
  const accessKey: any = await provider.query({
    request_type: 'view_access_key',
    finality: 'final',
    account_id: import.meta.env.VITE_NEAR_ACCOUNT_ID,
    public_key: publicKey,
  })

  return BigInt(accessKey.nonce) + 1n
}

export function getUserId(address: string, chainType: string) {
  return chainType === 'solana'
    ? { Sol: address }
    : { Evm: address.replace(/^0x/, '').toLowerCase() }
}

export type NearSecp256k1Signature = {
  scheme: string
  big_r: { affine_point: string }
  s: { scalar: string }
  recovery_id: number
}

/** Execution outcome shape used when parsing sign_payload receipts (matches EXPERIMENTAL_tx_status). */
export type IFinalExecutionOutcome = {
  transaction?: { hash?: string }
  receipts?: Array<{
    receipt?: {
      Action?: {
        actions?: Array<{ FunctionCall?: { method_name?: string } }>
      }
    }
  }>
  receipts_outcome?: Array<{
    outcome?: { status?: { SuccessValue?: string } }
  }>
}

const SIGNATURE_RECEIPT_METHOD = 'return_signature_and_clean_state_on_success'

function parseSignatureFromBase64SuccessValue(data: string): NearSecp256k1Signature | null {
  try {
    const decoded = Buffer.from(data, 'base64').toString('utf8')
    const parsed = JSON.parse(decoded) as NearSecp256k1Signature
    if (
      parsed?.scheme &&
      parsed?.big_r?.affine_point &&
      parsed?.s?.scalar &&
      typeof parsed?.recovery_id === 'number'
    ) {
      return parsed
    }
  } catch {
    // invalid payload
  }
  return null
}

export async function checkNearTransactionStatus(
  txHash: string,
  signerAccountId: string
): Promise<IFinalExecutionOutcome> {
  const provider = getProvider()
  const rpc = provider as unknown as {
    sendJsonRpc: (method: string, params: unknown[]) => Promise<IFinalExecutionOutcome>
  }
  return rpc.sendJsonRpc('EXPERIMENTAL_tx_status', [txHash, signerAccountId])
}

/**
 * Extract secp256k1 signatures from a sign_payload batch transaction outcome (ref-ui-v2 dollaUtils parity).
 */
export async function getSignaturesFromBatchSignPayloadResult(
  outcome: IFinalExecutionOutcome | undefined,
  signerAccountId: string
): Promise<NearSecp256k1Signature[]> {
  if (!outcome) {
    return []
  }
  const txHash = outcome.transaction?.hash
  const source: IFinalExecutionOutcome =
    txHash && signerAccountId ? await checkNearTransactionStatus(txHash, signerAccountId) : outcome
  const receipts = source.receipts
  const receiptsOutcome = source.receipts_outcome
  if (!Array.isArray(receipts) || !Array.isArray(receiptsOutcome)) {
    return []
  }

  const signatures: NearSecp256k1Signature[] = []
  for (let idx = 0; idx < receipts.length; idx++) {
    if (
      receipts[idx]?.receipt?.Action?.actions?.[0]?.FunctionCall?.method_name !==
      SIGNATURE_RECEIPT_METHOD
    ) {
      continue
    }
    const data = receiptsOutcome[idx]?.outcome?.status?.SuccessValue
    if (!data) {
      continue
    }
    const sig = parseSignatureFromBase64SuccessValue(data)
    if (sig) {
      signatures.push(sig)
    }
  }
  return signatures
}

/** Every outcome in the batch has no Failure in receipts_outcome (ref-ui dollaUtils parity). */
export function allReceiptsSucceeded(
  outcomes: Array<{
    receipts_outcome?: Array<{ outcome?: { status?: unknown } }>
  }>
): boolean {
  for (const outcome of outcomes) {
    const receiptsOutcome = outcome?.receipts_outcome ?? []
    for (const ro of receiptsOutcome) {
      const status = ro?.outcome?.status
      if (status && typeof status === 'object' && 'Failure' in status) {
        return false
      }
    }
  }
  return true
}

export function nearSignatureToEvmSignatureHex(signature: NearSecp256k1Signature) {
  if (!isNearSecp256k1Signature(signature)) {
    throw new TypeError(
      'nearSignatureToEvmSignatureHex: expected on-chain NearSecp256k1Signature (big_r/s/recovery_id). NEP-413 wallet signatures are base64 bytes; use walletNep413SignatureToEvmHex instead.'
    )
  }
  const r = signature.big_r.affine_point.substring(2).padStart(64, '0')
  const s = signature.s.scalar.padStart(64, '0')
  const v = (signature.recovery_id + 27).toString(16).padStart(2, '0')
  return `0x${r}${s}${v}`
}

/**
 * Converts NEP-413 SignedMessage (base64 secp256k1 compact sig) or JSON NearSecp256k1Signature to 65-byte EVM hex.
 * Uses the same sha256(borsh) preimage as verifySignature in @near-wallet-selector/core.
 *
 * - On-chain JSON NearSecp256k1Signature: converted directly.
 * - secp256k1 full-access keys: compact 64-byte sig → EVM (tries s and n−s; resolves callbackUrl variants).
 * - ed25519: cannot produce an ecrecover-compatible EVM sig over the same hash; returns 0x + hex(64-byte NEP-413 sig)
 *   so the value is non-empty — the API must verify via NEP-413 / ed25519, not Ethereum personal_sign.
 */
export function walletNep413SignatureToEvmHex(
  signed: { signature: unknown; publicKey: string },
  nep413: Nep413SignPayload
): string | null {
  if (typeof signed.signature === 'string') {
    const fromChainShape = tryParseNearSecp256k1ToEvmHex(signed.signature)
    if (fromChainShape) {
      return fromChainShape
    }
  }

  const verifiedPayload = resolveVerifiedNep413Payload(signed, nep413)
  if (!verifiedPayload) {
    return null
  }

  const sigBytes = nep413SignatureBytes(signed)
  if (!sigBytes || sigBytes.length === 0) {
    return null
  }

  let pk: PublicKey
  try {
    pk = PublicKey.from(signed.publicKey)
  } catch {
    return null
  }

  if (pk.keyType === KeyType.ED25519) {
    return utils.hexlify(sigBytes)
  }

  if (pk.keyType !== KeyType.SECP256K1) {
    return null
  }

  if (sigBytes.length === 65) {
    const r = utils.hexlify(sigBytes.subarray(0, 32))
    const s = utils.hexlify(sigBytes.subarray(32, 64))
    let v = sigBytes[64]
    if (v < 27) {
      v += 27
    }
    return utils.hexlify(utils.concat([utils.arrayify(r), utils.arrayify(s), [v]]))
  }

  if (sigBytes.length !== 64) {
    return null
  }

  const borshPayload = serializeNep413(verifiedPayload)
  const msgHash = utils.arrayify(utils.sha256(borshPayload))
  const expectedPubHex = ('0x04' + Buffer.from(pk.data).toString('hex')).toLowerCase()

  const r = utils.hexlify(sigBytes.subarray(0, 32))
  const sHex = utils.hexlify(sigBytes.subarray(32, 64))
  const sBn = BigInt(sHex)
  const altSBn = SECP256K1_CURVE_ORDER - sBn
  const altSHex = utils.hexZeroPad(utils.hexlify(altSBn), 32)
  const sCandidates = Array.from(new Set([sHex, altSHex]))

  for (const s of sCandidates) {
    for (let recoveryParam = 0; recoveryParam < 4; recoveryParam++) {
      try {
        const recovered = utils.recoverPublicKey(msgHash, { r, s, recoveryParam }).toLowerCase()
        if (recovered === expectedPubHex) {
          const v = 27 + recoveryParam
          return utils.hexlify(utils.concat([utils.arrayify(r), utils.arrayify(s), [v]]))
        }
      } catch {
        // try next recovery id
      }
    }
  }
  return null
}

function isNearSecp256k1Signature(value: unknown): value is NearSecp256k1Signature {
  if (!value || typeof value !== 'object') {
    return false
  }
  const o = value as Record<string, unknown>
  const big_r = o.big_r
  const s = o.s
  return (
    typeof o.scheme === 'string' &&
    typeof o.recovery_id === 'number' &&
    big_r !== null &&
    typeof big_r === 'object' &&
    typeof (big_r as Record<string, unknown>).affine_point === 'string' &&
    s !== null &&
    typeof s === 'object' &&
    typeof (s as Record<string, unknown>).scalar === 'string'
  )
}

/** If the wallet returns NEP-413 secp256k1 JSON (object or JSON/base64 string), convert to EVM hex; otherwise null. */
export function tryParseNearSecp256k1ToEvmHex(raw: unknown): string | null {
  if (isNearSecp256k1Signature(raw)) {
    return nearSignatureToEvmSignatureHex(raw)
  }
  if (typeof raw !== 'string') {
    return null
  }
  const trimmed = raw.trim()
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (isNearSecp256k1Signature(parsed)) {
        return nearSignatureToEvmSignatureHex(parsed)
      }
    } catch {
      return null
    }
  }
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8')
    if (decoded.trim().startsWith('{')) {
      const parsed = JSON.parse(decoded) as unknown
      if (isNearSecp256k1Signature(parsed)) {
        return nearSignatureToEvmSignatureHex(parsed)
      }
    }
  } catch {
    // not base64 JSON
  }
  return null
}
