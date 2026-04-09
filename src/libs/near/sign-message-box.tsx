import { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { FinalExecutionOutcome } from 'near-api-js/lib/providers'
import Modal from '@/components/modal'
import useToast from '@/hooks/use-toast'
import Loading from '@/components/icons/loading'
import { batchSignPayload } from '@/contexts/wallet/near/adapter-contract'
import {
  getSignaturesFromBatchSignPayloadResult,
  type IFinalExecutionOutcome,
  type NearSecp256k1Signature,
} from '@/hooks/near/util'

type SignStatus = 'idle' | 'loading' | 'success'

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4.78L9.12 1H11L7.2 5.77L11 10.51H9.12L6 6.5L2.88 10.51H1L4.8 5.77L1 1H2.88L6 4.78Z"
        fill="#9CA3AF"
      />
    </svg>
  )
}

function SignGlyphIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 4L18 8M3 21L3.5 16.5L17.086 2.91421C17.9611 2.03906 19.3789 2.03906 20.254 2.91421C21.1292 3.78936 21.1292 5.20718 20.254 6.08233L6.5 19.5L3 21Z"
        stroke="#111827"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 6.5L17.5 11.5"
        stroke="#111827"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type SignMessageBoxProps = {
  open: boolean
  onClose: () => void
  messages: string[]
  /** Called after on-chain batch sign_payload succeeds (ref-ui-v2 parity). */
  onSign?: (signatures: NearSecp256k1Signature[]) => void
  /** Defaults to wallet selector account id when omitted. */
  signerAccountId?: string
  title?: string
  description?: string
  className?: string
}

export default function SignMessageBox({
  open,
  onClose,
  messages,
  onSign,
  signerAccountId: signerAccountIdProp,
  title = 'Sign message',
  description = 'Signing this message will not cost you any fees.',
  className,
}: SignMessageBoxProps) {
  const toast = useToast()
  const [signStatus, setSignStatus] = useState<SignStatus>('idle')

  useEffect(() => {
    if (open) {
      setSignStatus('idle')
    }
  }, [open])

  const handleSign = async () => {
    if (signStatus !== 'idle' || !messages.length) return
    const signerAccountId =
      signerAccountIdProp ?? window.selector?.store?.getState()?.accounts?.[0]?.accountId ?? ''
    if (!signerAccountId) {
      toast.fail({ title: 'No NEAR account signed in' })
      return
    }
    setSignStatus('loading')
    try {
      const result = await batchSignPayload({ messages })
      if (result?.successResult) {
        const outcomes = result.successResult as FinalExecutionOutcome[]
        const singleOutcome = outcomes?.[0] as IFinalExecutionOutcome | undefined
        const signatures = await getSignaturesFromBatchSignPayloadResult(singleOutcome, signerAccountId)
        if (signatures.length !== messages.length) {
          throw new Error('Signature count mismatch')
        }
        setSignStatus('success')
        window.setTimeout(() => {
          onSign?.(signatures)
          onClose()
        }, 200)
      } else {
        toast.fail({
          title: result?.errorResult?.message ?? 'Failed to sign message',
        })
        setSignStatus('idle')
      }
    } catch {
      toast.fail({ title: 'Failed to sign message' })
      setSignStatus('idle')
    }
  }

  const displayText = messages.length > 0 ? messages.join('\n\n') : ''

  return (
    <Modal open={open} onClose={onClose} className={clsx('z-[220]', className)} isForceNormal>
      <div
        className={clsx(
          'relative w-[min(92vw,388px)] rounded-[20px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]'
        )}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="px-6 pb-8 pt-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#8A87AA]/10">
              <SignGlyphIcon />
            </div>
            <h2 className="mt-4 text-center text-[16px] font-bold leading-tight tracking-tight text-[#111827]">
              {title}
            </h2>
            <p className="mt-2 max-w-[300px] text-[13px] leading-snug text-[#6B7280]">
              {description}
            </p>
          </div>

          <div className="mt-6 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <pre className="max-h-[min(40vh,220px)] overflow-y-auto whitespace-pre-wrap break-all font-mono text-[12px] leading-relaxed text-[#374151]">
              {displayText}
            </pre>
          </div>

          <button
            type="button"
            onClick={handleSign}
            disabled={signStatus === 'loading' || !messages.length}
            className={clsx(
              'button mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[14px] text-[14px] font-semibold transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/20',
              'bg-[#111827] text-white hover:opacity-90',
              signStatus === 'success' && 'pointer-events-none'
            )}
          >
            {signStatus === 'loading' && <Loading size={18} className="text-white" />}
            {signStatus === 'idle' && 'Sign'}
            {signStatus === 'loading' && 'Signing'}
            {signStatus === 'success' && 'Signed successfully'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
