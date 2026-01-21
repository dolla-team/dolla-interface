import { useBtcContext } from "@/views/btc/context";
import TopTraders from "./top-traders";
import Participant from "./participant";
import useTopBidders from "../use-top-bidders";
import usePoolBids from "../use-pool-bids";

export default function Traders() {
  const { pool } = useBtcContext();
  const { topBidders } = useTopBidders({
    chain: "near",
    limit: 10,
    offset: 0,
    pool_id: pool?.pool_id
  });
  const { bids, hasMore, loading, page, goToPage } = usePoolBids({
    chain: "near",
    pool_id: pool?.pool_id
  });

  return (
    <div className="w-full bg-white border border-[#E4E4E4] rounded-[20px]">
      <TopTraders data={topBidders} />
      <Participant
        data={bids}
        hasMore={hasMore}
        loading={loading}
        goToPage={goToPage}
        page={page}
      />
    </div>
  );
}
