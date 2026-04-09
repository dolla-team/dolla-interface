import Modal from '@/components/modal'
import clsx from 'clsx'

export type LoginWallet = 'privy' | 'near'

type WalletsModalProps = {
  open: boolean
  onClose: () => void
  onSelect: (method: LoginWallet) => void
}

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

function PrivyMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="14" cy="14" r="5" fill="#111827" />
      <rect x="24" y="11" width="22" height="6" rx="1.5" fill="#111827" />
      <text
        x="52"
        y="18.5"
        fill="#111827"
        fontSize="14"
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        privy
      </text>
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6zm0 0l8 6 8-6"
        stroke="#374151"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#111827" aria-hidden>
      <path d="M13.52 10.77 19.68 3h-1.46l-5.35 6.17L8.89 3H4l6.45 9.34L4 21h1.46l5.65-6.54L15.11 21H20l-6.48-9.23zM11.18 13l-.65-.94L5.7 4.06h2.31l4.2 6.02.65.94 5.44 7.8h-2.31l-4.42-6.33z" />
    </svg>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7a2 2 0 012-2h12v4H6a2 2 0 000 4h12v6H6a2 2 0 01-2-2V7z"
        stroke="#374151"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M16 11h4v2.5a1.5 1.5 0 01-3 0V11z"
        stroke="#374151"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NearMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 22V6h3.2l8.4 11.2V6H24v16h-3.1L12.5 11V22H8zm22 0V6h4v16h-4zm8-10.2V22h-4V6h4.2l6.8 10.2V6H49v16h-4.1l-6.9-10.2z"
        fill="#111827"
      />
    </svg>
  )
}

function IconTile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]',
        className
      )}
    >
      {children}
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span
      className={clsx(
        'absolute right-3 top-3 z-[1] rounded-full px-2 py-0.5 text-[11px] font-semibold leading-tight',
        className
      )}
    >
      {children}
    </span>
  )
}

export default function WalletsModal({ open, onClose, onSelect }: WalletsModalProps) {
  return (
    <Modal open={open} onClose={onClose} className="z-[220]" isMaskClose>
      <div className="relative w-[min(92vw,380px)] rounded-[20px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="px-6 pb-7 pt-9">
          <div className="flex flex-col items-center">
            <img src="/logo.svg" alt="" className="h-14 w-14 select-none" width={56} height={56} />
            <h2 className="mt-4 text-center text-[20px] font-bold leading-tight tracking-tight text-[#111827]">
              Login or Sign up
            </h2>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onSelect('privy')}
              className="relative w-full rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-left transition-colors hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/15"
            >
              <Badge className="bg-[#EDE9FE] text-[#6D28D9]">Recent</Badge>
              <div className="flex items-center gap-3 pr-14 pt-1">
                <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6]">
                  <PrivyMark className="h-7 w-[5.5rem]" />
                </div>
                <div className="flex flex-1 flex-wrap justify-end gap-2 sm:justify-start">
                  <IconTile>
                    <GoogleIcon className="h-5 w-5" />
                  </IconTile>
                  <IconTile>
                    <EmailIcon className="h-5 w-5" />
                  </IconTile>
                  <IconTile>
                    <XIcon className="h-4 w-4" />
                  </IconTile>
                  <IconTile>
                    <WalletIcon className="h-5 w-5" />
                  </IconTile>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelect('near')}
              className="relative w-full rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-left transition-colors hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/15"
            >
              <Badge className="bg-[#DCFCE7] text-[#15803D]">New</Badge>
              <div className="flex items-center gap-4 pr-14 pt-1">
                <div
                  className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    background: 'linear-gradient(145deg, #50EFB5 0%, #7AF0C8 45%, #A1F4D0 100%)',
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px),
                        repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px)
                      `,
                    }}
                  />
                  <NearMark className="relative z-[1] h-7 w-[4.25rem]" />
                </div>
                <span className="text-[16px] font-bold text-[#111827]">near wallet</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
