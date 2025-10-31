import LucyDrawHistoryPanel from "./panel";
import LuckyDrawModal from "../lucky-draw-modal";
import useLuckyDrawStore from "@/stores/use-lucky-draw";
import useLucyDraw from "../use-lucky-draw";
import { useConfigStore } from "@/stores/use-config";

export default function LucyDrawHistory() {
  const { currentRound, isLoading, fetchCurrentRound } = useLucyDraw();
  const configStore = useConfigStore();
  const lucyDrawStore = useLuckyDrawStore();
  const historyParams = {
    historyRound: lucyDrawStore.historyRound,
    isLoading,
    fetchCurrentRound,
    prizeAmount: configStore.config?.prizeAmount || 0,
    currentRound
  };
  return (
    <LuckyDrawModal
      open={lucyDrawStore.showHistory}
      onClose={() => lucyDrawStore.set({ showHistory: false })}
      status={0}
    >
      <LucyDrawHistoryPanel
        {...historyParams}
        onClose={() => lucyDrawStore.set({ showHistory: false })}
      />
    </LuckyDrawModal>
  );
}
