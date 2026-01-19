import Modal from "@/components/modal";
import Button from "@/components/button";
import useCheckXkol from "@/hooks/user/use-check-xkol";

export default function XKolModal() {
  const { reward, redeemReward, redeeming } = useCheckXkol();

  if (reward === 0) {
    return null;
  }
  return (
    <Modal open={true}>
      <div className="relative bg-cover bg-center bg-no-repeat w-[454px] h-[355px] bg-[url('/kol/x-kol-bg.png')] bg-no-repeat bg-center bg-contain">
        <div className="text-[20px] font-[500] text-black text-center pt-[50px]">
          Congrats!
        </div>
        <div className="text-[16px] font-[400] text-black text-center mt-[20px]">
          You have ${reward} voucher to be redeemed
        </div>
        <div className="w-[340px] h-[95px] mt-[20px] mx-auto pl-[60px] flex items-center justify-center bg-[url('/kol/x-kol-ticket.png')] bg-no-repeat bg-center bg-contain">
          <span className="text-[32px] text-black font-[Courier]">
            ${reward} Voucher
          </span>
        </div>
        <Button
          onClick={redeemReward}
          disabled={redeeming}
          loading={redeeming}
          className="w-[340px] h-[46px] mt-[20px] mx-auto rounded-[12px] !bg-black text-white font-[500] text-[14px]"
        >
          Redeem
        </Button>
      </div>
    </Modal>
  );
}
