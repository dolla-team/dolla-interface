import React, { useState } from "react";
import Modal from "@/components/modal";
import Button from "@/components/button";

interface XKolModalProps {}

export default function XKolModal({}: XKolModalProps) {
  return (
    <Modal open={true}>
      <div className="relative bg-cover bg-center bg-no-repeat w-[454px] h-[355px] bg-[url('/kol/x-kol-bg.png')] bg-no-repeat bg-center bg-contain">
        <div className="text-[20px] font-[500] text-black text-center pt-[50px]">
          Congrats!
        </div>
        <div className="text-[16px] font-[400] text-black text-center mt-[20px]">
          You have $5 voucher to be redeemed
        </div>
        <div className="w-[340px] h-[95px] mt-[20px] mx-auto pl-[60px] flex items-center justify-center bg-[url('/kol/x-kol-ticket.png')] bg-no-repeat bg-center bg-contain">
          <span className="text-[32px] text-black font-[Courier]">
            $5 Voucher
          </span>
        </div>
        <Button className="w-[340px] h-[46px] mt-[20px] mx-auto rounded-[12px] !bg-black text-white font-[500] text-[14px]">
          Redeem
        </Button>
      </div>
    </Modal>
  );
}
