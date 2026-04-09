import DollaEye from '@/components/dolla-eye'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

function DesktopIllustration() {
  return (
    <svg
      className="mx-auto h-[120px] w-[160px] text-white/20"
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="12" y="16" width="136" height="88" rx="8" stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="28" width="112" height="64" rx="4" fill="currentColor" fillOpacity="0.12" />
      <path d="M56 112h48l-8-16H64l-8 16Z" fill="currentColor" fillOpacity="0.35" />
      <rect x="124" y="36" width="4" height="40" rx="2" fill="currentColor" fillOpacity="0.4" />
      <rect x="132" y="32" width="4" height="48" rx="2" fill="currentColor" fillOpacity="0.25" />
    </svg>
  )
}

export default function Mobile() {
  const handleCopyLink = useCallback(() => {
    const url = window.location.href
    void navigator.clipboard.writeText(url).then(
      () => {
        toast.success('Link copied. Open it in a desktop browser.')
      },
      () => {
        toast.error('Could not copy. Please copy the URL from the address bar.')
      }
    )
  }, [])

  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#0d0f12] text-white"
      id="verify-email-container"
      style={{
        paddingTop: 'max(24px, env(safe-area-inset-top))',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[12%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#dda900]/15 blur-[80px]"
        aria-hidden
      />
      <motion.div
        className="relative z-[1] mx-auto flex max-w-[400px] flex-col items-center px-6 pt-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <DollaEye className="mb-10 shrink-0" height={44} />
        <h1 className="font-alfa text-center text-[22px] leading-tight tracking-tight text-white md:text-2xl">
          Please use a desktop browser
        </h1>
        <p className="mt-4 text-center text-[14px] font-normal leading-[1.6] text-white/65">
          This product is optimized for desktop. Charts and interactions are most reliable on a full-sized
          screen.
        </p>
        <div className="mt-10 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-sm">
          <DesktopIllustration />
          <ol className="mt-6 space-y-3 text-left text-[13px] leading-snug text-white/55">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dda900]/25 text-[11px] font-medium text-[#f5d565]">
                1
              </span>
              <span>Open a desktop browser on your computer, such as Chrome, Edge, or Safari.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dda900]/25 text-[11px] font-medium text-[#f5d565]">
                2
              </span>
              <span>
                Type this site&apos;s URL in the address bar, or tap the button below to copy the link and
                paste it on your computer.
              </span>
            </li>
          </ol>
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="mt-8 w-full max-w-[320px] rounded-xl bg-[#dda900] py-3.5 text-[15px] font-medium text-black transition hover:bg-[#e8b41a] active:scale-[0.98]"
        >
          Copy page link
        </button>
        <p className="mt-4 text-center text-[12px] text-white/35">
          Thanks for your understanding — see you on desktop.
        </p>
      </motion.div>
    </div>
  )
}
