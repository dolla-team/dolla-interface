import Modal from "@/components/modal";
import WinnerShareCard from "./winner";
import { useRef } from "react";
import Button from "@/components/button";
import { useShare } from "./use-share";
import ModalClose from "@/components/button/modal-close";

const SHARE_OPTIONS: Record<string, any> = {
  winner: {
    title: "I am a title",
    description: "I am a description"
  }
};

export default function ShareModal({ open, onClose, type, data }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { generateAndDownload, generateAndShare, downloading, sharing } =
    useShare();

  return (
    <Modal open={open} onClose={onClose}>
      <ModalClose
        onClose={onClose}
        className="absolute right-[16px] top-[16px] z-[2]"
      />
      <div className="p-[20px] w-[550px] h-[420px] bg-white rounded-[20px] pt-[30px]">
        <div className="w-[500px] h-[291px] relative">
          <div className=" scale-50 origin-center absolute left-[-244px] top-[-130px]">
            {type === "winner" && (
              <>
                <WinnerShareCard data={data} cardRef={cardRef} />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-[10px] mt-[20px]">
          <Button
            loading={downloading}
            onClick={async () => {
              if (!cardRef.current || downloading) return;

              await generateAndDownload(
                cardRef.current,
                `share-${Date.now()}`,
                {
                  format: "png",
                  quality: 1,
                  pixelRatio: 1,
                  backgroundColor: "#000",
                  width: 1000,
                  height: 562.5
                }
              );
            }}
            className="w-[182px] h-[52px] rounded-[8px] border border-[#383F47]/30 gap-[6px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M1 11.1333V17H17V11.1333M9.00791 12.2V1M9.00791 12.2L13.6061 7.45815M9.00791 12.2L4.40976 7.45815"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[14px] text-black">Save Image</span>
          </Button>
          <Button
            loading={sharing}
            onClick={() => {
              if (!cardRef.current || sharing) return;
              generateAndShare(
                cardRef.current as HTMLElement,
                SHARE_OPTIONS[type]
              );
            }}
            className="w-[182px] h-[52px] !bg-black rounded-[8px] border border-[#383F47]/30  gap-[6px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="17"
              viewBox="0 0 18 17"
              fill="none"
            >
              <path
                d="M6.5814 2C7.13368 2 7.5814 1.55228 7.5814 1C7.5814 0.447715 7.13368 0 6.5814 0V1V2ZM1 1V0H0V1H1ZM1 16H0V17L1 17L1 16ZM14.7674 16L14.7674 17L15.7674 17V16H14.7674ZM15.7674 9.47367C15.7674 8.92138 15.3197 8.47367 14.7674 8.47367C14.2152 8.47367 13.7674 8.92138 13.7674 9.47367H14.7674H15.7674ZM6.69767 10.9473C6.69767 11.4996 7.14539 11.9473 7.69767 11.9473C8.24996 11.9473 8.69767 11.4996 8.69767 10.9473H7.69767H6.69767ZM17 4.68417V5.68417C17.4291 5.68417 17.8103 5.41045 17.9475 5.0039C18.0847 4.59736 17.9472 4.1486 17.6059 3.88863L17 4.68417ZM12.7687 0.204463C12.3293 -0.130169 11.7019 -0.0452679 11.3673 0.394095C11.0326 0.833458 11.1175 1.4609 11.5569 1.79554L12.1628 1L12.7687 0.204463ZM6.5814 1V0H1V1V2H6.5814V1ZM1 1H0V16H1H2V1H1ZM1 16L1 17L14.7674 17L14.7674 16L14.7674 15L0.999999 15L1 16ZM14.7674 16H15.7674V9.47367H14.7674H13.7674V16H14.7674ZM7.69767 10.9473H8.69767C8.69767 9.77586 8.90896 8.90904 9.2513 8.25824C9.58884 7.61656 10.0832 7.12812 10.7482 6.75186C12.1316 5.96917 14.2249 5.68417 17 5.68417V4.68417V3.68417C14.1937 3.68417 11.6358 3.95177 9.76338 5.01116C8.80049 5.55595 8.01581 6.31093 7.48125 7.32715C6.9515 8.33424 6.69767 9.53981 6.69767 10.9473H7.69767ZM17 4.68417L17.6059 3.88863L12.7687 0.204463L12.1628 1L11.5569 1.79554L16.3941 5.4797L17 4.68417Z"
                fill="white"
              />
            </svg>
            <span className="text-[14px] text-white">Share</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
