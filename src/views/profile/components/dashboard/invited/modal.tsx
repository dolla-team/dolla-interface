import Modal from "@/components/modal";
import Pagination from "@/components/pagination";
import Avatar from "@/components/avatar";
import useReferralList from "@/hooks/airdrop/use-referral-list";
import dayjs from "@/libs/dayjs";
import clsx from "clsx";
import Loading from "@/components/icons/loading";

const LIMIT = 10;

export default function InvitedModal({
  open,
  onClose,
  referralData,
  currentPage,
  nextPage,
  prevPage,
  loading
}: any) {
  const {} = useReferralList();

  const totalPages = Math.ceil(Number(referralData?.total_num || 0) / LIMIT);

  const hasNextPage =
    currentPage < totalPages && (referralData?.list?.length || 0) >= LIMIT;

  const handlePrev = (_page?: number) => {
    prevPage();
  };

  const handleNext = (_page?: number) => {
    nextPage();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={clsx("w-[654px] rounded-[20px] bg-white")}>
        {/* Header */}
        <div className="w-full shrink-0 flex justify-between items-center rounded-t-[16px] p-[17px_23px_16px_31px] bg-black">
          <div className="text-[#fff] text-[16px] font-[500] leading-[100%]">
            Invited
          </div>
          <button type="button" className="button shrink-0" onClick={onClose}>
            <img
              src="/profile/icon-close.svg"
              className="w-[10px] h-[12px] shrink-0"
            />
          </button>
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#2B3337] p-[20px_30px_6px_18px] border-b border-[#E4E4E4]">
          <span>User</span>
          <span>Joined Time</span>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-[40px] text-[#8C8B8B] text-[14px]">
              <Loading size={20} />
            </div>
          ) : !referralData?.list || referralData.list.length === 0 ? (
            <div className="flex items-center justify-center py-[40px] text-[#8C8B8B] text-[14px]">
              No invited friends yet
            </div>
          ) : (
            <div className="flex flex-col">
              {referralData.list.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between h-[48px] pl-[10px] pr-[22px] mx-[8px] rounded-[8px] hover:bg-[#F2F2F299] transition-colors cursor-pointer"
                >
                  <Avatar
                    src={item.account_icon}
                    address={item.account_id}
                    size={32}
                    className="rounded-full"
                  />
                  <div className="text-[12px] text-[#2B3337] font-[500]">
                    {dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {referralData?.list && referralData.list.length > 0 && (
          <div className="w-full shrink-0 flex justify-end items-center px-[20px] py-[16px] border-t border-[#E4E4E4] max-md:px-[10px]">
            <Pagination
              current={currentPage}
              total={totalPages}
              size={LIMIT}
              hasNextPage={hasNextPage}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
