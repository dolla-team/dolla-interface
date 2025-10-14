import { formatNumber } from "@/utils/format/number";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import AddBtn from "@/views/btc/components/bid-selection/laptop/add-btn";

export default function AvatarCashier({
  onClick,
  tokenBalance
}: {
  onClick: (e: any) => void;
  tokenBalance: string;
}) {
  const isMobile = useIsMobile();
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center cursor-pointer rounded-[10px] px-3 h-[36px] relative z-[2]",
        isMobile
          ? "p-[10px] border border-[#3B3951] bg-[#FFFFFF1A] gap-[8px]"
          : "bg-gradient-to-b from-[#2B3337] to-[#7B929D] gap-1"
      )}
    >
      <svg
        width="19"
        height="16"
        viewBox="0 0 19 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.709 0C17.3156 0 18.6182 1.30253 18.6182 2.90918V13.0908C18.6182 14.6975 17.3156 16 15.709 16H2.90918C1.30253 16 0 14.6975 0 13.0908V2.90918C0 1.30253 1.30253 0 2.90918 0H15.709ZM2.90918 1.4541C2.10714 1.4541 1.4541 2.10714 1.4541 2.90918V13.0908C1.4541 13.8929 2.10714 14.5459 2.90918 14.5459H15.709C16.511 14.5459 17.1641 13.8929 17.1641 13.0908V11.418H11.4912C10.2862 11.418 9.30957 10.4413 9.30957 9.23633V6.76367C9.30957 5.55869 10.2862 4.58203 11.4912 4.58203H17.1641V2.90918C17.1641 2.10714 16.511 1.4541 15.709 1.4541H2.90918ZM11.4912 6.03613C11.0902 6.03613 10.7637 6.36265 10.7637 6.76367V9.23633C10.7637 9.63735 11.0902 9.96387 11.4912 9.96387H17.1641V6.03613H11.4912ZM15.709 7.27246C15.8528 7.27246 15.9937 7.31559 16.1133 7.39551C16.2328 7.4754 16.3258 7.58888 16.3809 7.72168C16.4359 7.85446 16.4508 8.00064 16.4229 8.1416C16.3948 8.28268 16.3253 8.41294 16.2236 8.51465C16.1219 8.61633 15.9916 8.68483 15.8506 8.71289C15.7096 8.74087 15.5635 8.72688 15.4307 8.67188C15.2979 8.61686 15.1844 8.52376 15.1045 8.4043C15.0246 8.2847 14.9814 8.14384 14.9814 8C14.9814 7.80712 15.0589 7.62174 15.1953 7.48535C15.3316 7.34926 15.5163 7.27249 15.709 7.27246Z"
          fill={isMobile ? "#FFE9B2" : "white"}
        />
      </svg>
      <div
        className={clsx(
          "text-[12px] font-[600] ",
          isMobile ? "text-[#FFE9B2]" : "text-white"
        )}
      >
        <span>${formatNumber(tokenBalance || "0", 2, true)}</span>
      </div>
      {isMobile && <AddBtn />}
    </div>
  );
}
