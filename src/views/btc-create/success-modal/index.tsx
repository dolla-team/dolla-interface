import { BASE_TOKEN } from "@/config/btc";
import { useAuth } from '@/contexts/wallet'
import Big from "big.js";
import ShareModal from "@/sections/share";
import { useMemo } from 'react'

export default function SuccessModal({
  open,
  data,
  price,
  onClose,
}: {
  open: boolean
  data: any
  price: number
  onClose: () => void
}) {
  const { userInfo } = useAuth()

  const mergedData = useMemo(() => {
    return {
      accumulative_bids: 0,
      anchor_price: 0,
      price: Big(price)
        .mul(data?.amount || 0)
        .toFixed(0),
      reward_amount: Big(data?.amount || 0)
        .mul(10 ** BASE_TOKEN.decimals)
        .toFixed(0),
      pool_id: data?.pool_id,
      user: {
        icon: userInfo?.icon,
        name: userInfo?.name,
        user: userInfo?.user,
      },
      status: 1,
      participants: 0,
    }
  }, [data, price])

  return (
    <ShareModal open={open} onClose={onClose} type="pool" data={mergedData} hasViewButton={true} />
  )
}
