import { create } from "zustand";

interface CancelledPoolsState {
  cancelledPools: any[];
  refundAmount: number;
  set: (params: any) => void;
  removeCancelledPool: (poolId: string) => void;
}

const useCancelledPoolsStore = create<CancelledPoolsState>((set) => ({
  cancelledPools: [],
  refundAmount: 0,
  set: (params) => set(() => ({ ...params })),
  removeCancelledPool: (poolId: string) =>
    set((state) => ({
      cancelledPools: state.cancelledPools.filter(
        (item) => item.pool_id !== poolId
      )
    }))
}));

export default useCancelledPoolsStore;
