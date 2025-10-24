import React from "react";
import Modal from "./index";
import Button from "../button";
import ModalClose from "../button/modal-close";

interface LoginTimeoutModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

const LoginTimeoutModal: React.FC<LoginTimeoutModalProps> = ({
  open,
  onClose,
  className
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={className}
      isMaskClose={false}
    >
      <div className="bg-white rounded-[20px] p-[24px] w-[320px] relative">
        {/* Close button */}
        <div className="absolute top-[16px] right-[16px]">
          <ModalClose onClose={onClose} />
        </div>

        {/* Timeout icon */}
        <div className="flex justify-center mb-[16px]">
          <div className="w-[64px] h-[64px] bg-[#FFF5F5] rounded-full flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
                stroke="#FF6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 8V16L20 20"
                stroke="#FF6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-[600] text-[#2B3337] text-center mb-[8px]">
          Timeout
        </h3>

        {/* Description */}
        <p className="text-[14px] text-[#6B7280] text-center mb-[24px] leading-[20px]">
          Your session has expired. You can refresh the page to retry or keep
          trying.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[12px] justify-center">
            <Button
              onClick={() => {
                window.location.reload();
              }}
              className="h-[40px] w-[140px] !bg-black text-white"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginTimeoutModal;
