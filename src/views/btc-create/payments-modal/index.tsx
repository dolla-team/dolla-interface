import Modal from "@/components/modal";
import Button from "@/components/button";
import { GameIcon, WalletIcon, CexIcons } from "./icons";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAuth } from '@/contexts/wallet'

const Items = [
  {
    title: "Using Game Account",
    desc: "Using your game account to create market, but you might need to deposit assets in to game account first.",
    icon: <GameIcon />,
    btnText: "Create Market"
  },
  {
    title: "Connect Another Wallet",
    desc: "Using the wallet with assets, you can deposit your assets into market directly.",
    icon: <WalletIcon />,
    btnText: "Connect"
  },
  {
    title: "Using CEX",
    desc: "You can transfer your assets from CEX to the game account.",
    icon: <CexIcons />,
    btnText: "Transfer"
  }
];

export default function PaymentsModal({
  open,
  onClose,
  onSelectMethod
}: {
  open: boolean;
  onClose: () => void;
  onSelectMethod: (method: number) => void;
}) {
  const { address } = useAuth();
  const { openConnectModal } = useConnectModal();
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[694px] h-[352px] rounded-[6px] bg-[#232932] p-[23px]">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-bold text-white">
            Create Market by 3 Ways
          </div>
          <button className="button p-[6px]" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="9"
              viewBox="0 0 10 9"
              fill="none"
            >
              <path
                d="M5 3.375L8 0H10L6 4.5L10 9H8L5 5.625L2 9H0L4 4.5L0 0H2L5 3.375Z"
                fill="#5E6B7D"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-[20px] mt-[20px]">
          {Items.map((item, i) => (
            <Item
              key={item.title}
              data={item}
              onClick={() => {
                onSelectMethod(i + 1);
                if (i === 1 && !address) {
                  openConnectModal?.();
                }
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}

const Item = ({ data, onClick }: any) => {
  return (
    <div className="w-[203px] h-[248px] rounded-[6px] bg-[#191E27] py-[20px] flex flex-col items-center">
      <div className="text-[16px] font-semibold text-white mb-[20px]">
        {data.title}
      </div>
      <div className="h-[30px]">{data.icon}</div>
      <div className="text-[12px] text-[#ADBCCF] mt-[20] px-[10px] leading-[14px] text-center mt-[20px] h-[60px]">
        {data.desc}
      </div>
      <div className="mt-[20px]">
        <Button
          onClick={onClick}
          className="px-[30px] h-[30px] text-[16px] font-medium"
        >
          {data.btnText}
        </Button>
      </div>
    </div>
  );
};
