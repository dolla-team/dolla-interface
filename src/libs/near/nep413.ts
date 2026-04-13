/**
 * NEP-413 payload serialization and signature verification (same algorithm as legacy wallet-selector).
 * @see https://github.com/near/NEPs/blob/master/neps/nep-0413.md
 */
import { PublicKey } from '@near-js/crypto'
import { serialize, type Schema } from 'borsh'
import { utils } from 'ethers'

export type SignMessageParamsForNep413 = {
  message: string
  nonce: Buffer
  recipient: string
  callbackUrl?: string
}

export type VerifyNep413SignatureParams = SignMessageParamsForNep413 & {
  publicKey: string
  signature: string
}

class Nep413Payload {
  tag: number
  message: string
  nonce: Buffer
  recipient: string
  callbackUrl?: string

  constructor(data: SignMessageParamsForNep413) {
    this.tag = 2147484061
    this.message = data.message
    this.nonce = data.nonce
    this.recipient = data.recipient
    if (data.callbackUrl) {
      this.callbackUrl = data.callbackUrl
    }
  }
}

const nep413PayloadSchema: Schema = {
  struct: {
    tag: 'u32',
    message: 'string',
    nonce: { array: { type: 'u8', len: 32 } },
    recipient: 'string',
    callbackUrl: { option: 'string' },
  },
}

export function serializeNep413(signMessageParams: SignMessageParamsForNep413): Buffer {
  const payload = new Nep413Payload(signMessageParams)
  return Buffer.from(serialize(nep413PayloadSchema, payload))
}

export function verifyNep413Signature(params: VerifyNep413SignatureParams): boolean {
  const payload = new Nep413Payload(params)
  const borshPayload = Buffer.from(serialize(nep413PayloadSchema, payload))
  const hashedPayload = utils.arrayify(utils.sha256(borshPayload))
  const realSignature = Buffer.from(params.signature, 'base64')
  const pk = PublicKey.from(params.publicKey)
  return pk.verify(hashedPayload, realSignature)
}
