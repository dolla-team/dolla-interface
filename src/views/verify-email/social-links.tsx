import { TgIcon, TwitterIcon, GitBookIcon } from './social-icons'

const SocialLinks = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <button
        className="button flex items-center gap-[4px]"
        onClick={() => {
          window.open('https://x.com/Dollamarket', '_blank')
        }}
      >
        <TwitterIcon />
      </button>
      <button
        className="button flex items-center gap-[4px]"
        onClick={() => {
          window.open('https://t.me/+rlArBTaYhw8zNDM1', '_blank')
        }}
      >
        <TgIcon />
      </button>
      <button
        className="button flex items-center gap-[4px]"
        onClick={() => {
          window.open('https://docs.dolla.market/', '_blank')
        }}
      >
        <GitBookIcon />
      </button>
    </div>
  )
}

export default SocialLinks
