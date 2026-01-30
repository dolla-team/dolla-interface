import YouBoughtItem from "./item";
import Cancel from "./cancel";
import { useBtcContext } from "@/views/btc/context";
import useUserPoolBids from "../use-user-pool-bids";
import Pagination from '@/components/pagination'
import Loading from '@/components/icons/loading'
import { useMemo } from 'react'

export default function YouBought() {
  const { pool } = useBtcContext();
  const { bids, page, hasMore, loading, goToPage } = useUserPoolBids({
    chain: 'near',
    pool_id: pool?.pool_id,
  })
  const [totalBids, totalTimes] = useMemo(() => {
    const userData = pool?.user_draw_attempt
    return [userData?.times || 0, userData?.played_number || 0]
  }, [pool])

  return (
    <div className="mt-[20px]">
      <div className="text-[16px] font-[600] text-black">You Bid</div>
      {totalTimes > 0 ? (
        <>
          <div className="w-full py-[12px] bg-[#0000000D] border border-[#F2F2F233] rounded-[10px] mt-[16px] text-[16px] text-black font-[600]">
            <div className="flex items-center justify-around">
              <span>{totalTimes} times</span>
              <span>${totalBids}</span>
            </div>
            {pool?.status === 3 && pool?.user_draw_attempt && <Cancel />}
          </div>
          <div className="flex flex-col gap-[8px] mt-[10px] h-[760px] overflow-x-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loading size={20} />
              </div>
            ) : (
              bids?.map((item: any) => <YouBoughtItem key={item.id} data={item} />)
            )}
          </div>
          {totalTimes > 9 && (
            <div className="flex justify-end items-center mr-[20px]">
              <Pagination
                current={page}
                hasNextPage={hasMore}
                onNext={() => goToPage(page + 1)}
                onPrev={() => goToPage(page - 1)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-[42px] bg-[#0000000D] border border-[#F2F2F233] rounded-[12px] mt-[16px] flex items-center justify-around text-[14px] text-[#8C8B8B] font-[400]">
          {loading ? <Loading size={20} /> : <span>You didn’t participate in</span>}
        </div>
      )}
    </div>
  )
}
