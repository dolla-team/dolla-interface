import Switch from "@/components/switch";
import { useNavigate } from "@/libs/router";
import useLoginStore from '@/stores/use-login'

export default function Tabs({ tab }: { tab: string }) {
  const navigate = useNavigate();
  const wallet = useLoginStore(s => s.wallet)
  const listerDisabled = wallet === 'near'

  return (
    <div className="flex justify-end mt-[20px]">
      <Switch
        tab={tab}
        tabs={[
          { label: 'Bidder', value: 'bidder' },
          { label: 'Lister', value: 'lister', disabled: listerDisabled },
        ]}
        onChange={value => {
          navigate(`/portfolio/${value}`)
        }}
        className="!h-[30px] !border-[1px] !border-[#666666] !rounded-[8px] !p-[1px] bg-[#D9D9D94D]"
        cursorClassName="!rounded-[8px] !shadow-[unset] !bg-[#1A1E24]"
        tabClassName="!px-[15px] !text-white !rounded-[8px] !bg-transparent"
      />
    </div>
  )
}
