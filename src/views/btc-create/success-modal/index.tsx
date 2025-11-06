import { BASE_TOKEN } from "@/config/btc";
import { useAuth } from "@/contexts/auth";
import Big from "big.js";
import ShareModal from "@/sections/share";

export default function SuccessModal({
  open,
  data,
  onClose
}: {
  open: boolean;
  data: any;
  onClose: () => void;
}) {
  const { userInfo } = useAuth();

  return (
    <ShareModal
      open={open}
      onClose={onClose}
      type="pool"
      data={{
        accumulative_bids: 0,
        anchor_price: 0,
        reward_amount: Big(data?.amount || 0)
          .mul(10 ** BASE_TOKEN.decimals)
          .toFixed(0),
        pool_id: data?.pool_id,
        user: {
          icon: userInfo?.icon,
          email: userInfo?.show_email,
          name: userInfo?.name,
          user: userInfo?.user
        },
        status: 1,
        participants: 0
      }}
      hasViewButton={true}
    />
  );
}
