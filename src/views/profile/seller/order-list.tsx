import Market from "@/views/btc/components/more-markets/market";
import Button from "@/components/button";
import dayjs from "dayjs";
import CancelModal from "./cancel-modal";
import { useState } from "react";
import Loading from "@/components/icons/loading";

export default function OrderList({
  orders,
  poolsData,
  updatePoolsData,
  loading
}: {
  orders: any[];
  poolsData: any;
  updatePoolsData: (poolId: number, data?: any) => Promise<void>;
  loading: boolean;
}) {
  const [cancelModal, setCancelModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  if (orders.length === 0 && !loading) {
    return (
      <div className="text-[14px] text-[#5E6B7D] w-full h-[300px] flex items-center justify-center">
        No data
      </div>
    );
  }
  if (loading) {
    return (
      <div className="text-[14px] text-[#5E6B7D] w-full h-[300px] flex items-center justify-center">
        <Loading size={20} />
      </div>
    );
  }
  return (
    <div className="flex gap-[16px] flex-wrap">
      {orders.map((order) => (
        <OrderItem
          key={order}
          order={order}
          poolsData={poolsData}
          onCancel={() => {
            setCurrentOrder(poolsData[order]);
            setCancelModal(true);
          }}
          onDeposit={() => {
            setCurrentOrder(poolsData[order]);
          }}
          onClaimSuccess={() => {
            updatePoolsData(order, {
              is_claim: true
            });
          }}
        />
      ))}
      {currentOrder && (
        <>
          <CancelModal
            open={cancelModal}
            onClose={() => setCancelModal(false)}
            order={currentOrder}
            onSuccess={(params: any) => {
              updatePoolsData(currentOrder.pool_id, params);
              setCurrentOrder(null);
              setCancelModal(false);
            }}
          />
        </>
      )}
    </div>
  );
}

const OrderItem = ({
  order: orderId,
  onCancel,
  onDeposit,
  poolsData,
  onClaimSuccess
}: {
  order: any;
  onCancel: () => void;
  onDeposit: () => void;
  poolsData: any;
  onClaimSuccess: () => void;
}) => {
  const order = poolsData[orderId];

  return (
    <Market
      key={order.id}
      data={order}
      className="w-[311px] h-[200px]"
      footer={
        <div className="border-t border-t-[#2F3843] mt-[24px] flex justify-between items-center text-[12px] h-[46px] px-[12px]">
          <span className="text-[#5E6B7D]">
            {dayjs(order.updated_at).format("HH:mm DD MMM, YYYY")}
          </span>
          <div className="flex items-center gap-[6px]">
            {/* {order.is_claim && (
              <Button className="px-[10px] h-[26px] text-[12px]" disabled>
                Claimed
              </Button>
            )} */}
            {order.status !== 3 && order.status !== 2 && (
              <Button
                className="px-[10px] h-[26px] text-[12px] border border-[#2F3843] !bg-[#1A1E24] !text-[#ADBCCF]"
                isPrimary={false}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            {order.status === 3 && (
              <Button
                className="px-[10px] h-[26px] text-[12px] border border-[#2F3843] !bg-[#1A1E24] !text-[#ADBCCF]"
                disabled
                isPrimary={false}
              >
                Cancelled
              </Button>
            )}
          </div>
        </div>
      }
    />
  );
};
