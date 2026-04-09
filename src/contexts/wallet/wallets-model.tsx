import DollaEye from '@/components/dolla-eye'
import Modal from '@/components/modal'
import clsx from 'clsx'
import useLoginStore from '@/stores/use-login'

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

function GoogleIcon() {
  return <img src="/wallets/privy-google.png" alt="google" className="h-[14px] w-[17px]" />
}

function EmailIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
      <path
        d="M13.2143 0C13.4488 -2.0519e-09 13.681 0.0470286 13.8976 0.138401C14.1143 0.229773 14.3112 0.363699 14.477 0.532533C14.6428 0.701367 14.7743 0.901802 14.8641 1.12239C14.9538 1.34299 15 1.57941 15 1.81818V10.1818C15 10.4206 14.9538 10.657 14.8641 10.8776C14.7743 11.0982 14.6428 11.2986 14.477 11.4675C14.3112 11.6363 14.1143 11.7702 13.8976 11.8616C13.681 11.953 13.4488 12 13.2143 12H1.78571C1.55121 12 1.319 11.953 1.10235 11.8616C0.885698 11.7702 0.688843 11.6363 0.523024 11.4675C0.357205 11.2986 0.22567 11.0982 0.135929 10.8776C0.0461889 10.657 -2.01526e-09 10.4206 0 10.1818V1.81818C0 1.57941 0.0461889 1.34299 0.135929 1.12239C0.22567 0.901802 0.357205 0.701367 0.523024 0.532533C0.688843 0.363699 0.885698 0.229773 1.10235 0.138401C1.319 0.0470286 1.55121 -2.0519e-09 1.78571 0H13.2143ZM1.42857 2.03164V10.1818C1.42857 10.2296 1.43781 10.2769 1.45576 10.321C1.47371 10.3651 1.50001 10.4052 1.53318 10.4389C1.56634 10.4727 1.60571 10.4995 1.64904 10.5178C1.69237 10.536 1.73881 10.5455 1.78571 10.5455H13.2143C13.2612 10.5455 13.3076 10.536 13.351 10.5178C13.3943 10.4995 13.4337 10.4727 13.4668 10.4389C13.5 10.4052 13.5263 10.3651 13.5442 10.321C13.5622 10.2769 13.5714 10.2296 13.5714 10.1818V2.04945L8.56321 6.43273C8.31875 6.6467 8.01039 6.77019 7.68827 6.78313C7.36614 6.79607 7.04919 6.6977 6.78893 6.504L6.72607 6.45455L1.42857 2.03164ZM12.0596 1.45455H2.99071L7.63179 5.32982L12.0596 1.45455Z"
        fill="black"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M7.73803 5.50525L12.5784 0H11.4318L7.22713 4.77915L3.8714 0H0L5.07563 7.22761L0 13H1.1466L5.58393 7.95197L9.1286 13H13M1.56043 0.846028H3.32193L11.4309 12.1955H9.66897"
        fill="black"
      />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
      <path
        d="M14.625 0C16.1209 0 17.334 1.20926 17.334 2.70117V12.1553C17.334 13.6472 16.1209 14.8574 14.625 14.8574H2.70801C1.21219 14.8574 0 13.6472 0 12.1553V2.70117C0 1.20928 1.21219 3.67092e-05 2.70801 0H14.625ZM2.70801 1.35059C1.96132 1.35062 1.35352 1.95644 1.35352 2.70117V12.1553C1.35352 12.9 1.96132 13.5068 2.70801 13.5068H14.625C15.3717 13.5068 15.9795 12.9 15.9795 12.1553V10.7295H11.0137C9.94535 10.7293 9.0791 9.78585 9.0791 8.62207V6.23438C9.0791 5.07059 9.94535 4.12713 11.0137 4.12695H15.9795V2.70117C15.9795 1.95642 15.3717 1.35059 14.625 1.35059H2.70801ZM11.0137 5.53125C10.6582 5.53143 10.3691 5.84714 10.3691 6.23438V8.62207C10.3691 9.00931 10.6582 9.32502 11.0137 9.3252H15.9795V5.53125H11.0137Z"
        fill="black"
      />
    </svg>
  )
}

function IconTile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] bg-[#8A87AA]/10',
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
        'absolute right-3 top-1 z-[1] text-[12px] px-3 py-2 rounded-[6px] leading-tight',
        className
      )}
    >
      {children}
    </span>
  )
}

function WalletTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[30px] shrink-0 items-center rounded-[6px] bg-[#8A87AA]/10 px-2 text-[10px] font-semibold leading-none text-[#111827]">
      {children}
    </span>
  )
}

export default function WalletsModal({ open, onClose, onSelect }: WalletsModalProps) {
  const loginStore = useLoginStore()
  return (
    <Modal open={open} onClose={onClose} className="z-[220]" isMaskClose>
      <div className="relative w-[min(92vw,388px)] rounded-[20px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="px-6 pb-4 pt-12">
          <div className="flex flex-col items-center">
            <DollaEye onlyEye />
            <h2 className="mt-6 text-center text-[16px] font-bold leading-tight tracking-tight text-[#111827]">
              Login or Sign up
            </h2>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onSelect('privy')}
              className="relative cursor-pointer w-full rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-left transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-[#D1D5DB] hover:bg-[#F9FAFB] hover:shadow-[0_4px_20px_rgba(17,24,39,0.08)] active:bg-[#F3F4F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/15"
            >
              {loginStore.wallet === 'privy' && (
                <Badge className="bg-[#8A87AA]/10 text-[#8A87AA]">Recent</Badge>
              )}
              <div className="flex items-center gap-3 pr-14 pt-1">
                <img src="/wallets/privy.png" alt="near" className="h-[100px] w-[100px]" />
                <div className="flex flex-1 flex-wrap justify-end gap-2 sm:justify-start">
                  <IconTile>
                    <GoogleIcon />
                  </IconTile>
                  <IconTile>
                    <EmailIcon />
                  </IconTile>
                  <IconTile>
                    <XIcon />
                  </IconTile>
                  <IconTile>
                    <WalletIcon />
                  </IconTile>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelect('near')}
              className="relative cursor-pointer w-full rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-left transition-[border-color,background-color,box-shadow] duration-200 ease-out hover:border-[#D1D5DB] hover:bg-[#F9FAFB] hover:shadow-[0_4px_20px_rgba(17,24,39,0.08)] active:bg-[#F3F4F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/15"
            >
              {loginStore.wallet !== 'near' ? (
                <Badge className="bg-[#0EBD16]/10 text-[#0EBD16]">New</Badge>
              ) : (
                <Badge className="bg-[#8A87AA]/10 text-[#8A87AA]">Recent</Badge>
              )}
              <div className="flex items-center gap-3 pr-14 pt-1">
                <img src="/wallets/near.png" alt="NEAR" className="h-[100px] w-[100px]" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-[14px] font-[400] text-black">NEAR wallets</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
