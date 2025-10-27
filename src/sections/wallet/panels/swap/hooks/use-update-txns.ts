import { useHistoryStore } from "@/stores/use-swap-history";
import { useEffect } from "react";

export default function useUpdateTxns() {
  const historyStore = useHistoryStore();
  const updateTxns = async () => {
    const pendingStatus = JSON.parse(
      JSON.stringify(historyStore.pendingStatus)
    );
    while (pendingStatus.length > 0) {
      const address = pendingStatus.pop();
      const response = await fetch(
        `https://1click.chaindefuser.com/v0/status?depositAddress=${address}`
      );
      const result = await response.json();
      console.log(result);
      let status = result.status;
      if (status === "PENDING_DEPOSIT") {
        if (result.quoteResponse?.quote?.deadline) {
          const isTimeout =
            Date.now() >
            new Date(result.quoteResponse?.quote?.deadline).getTime();
          if (isTimeout) {
            status = "FAILED";
          }
        }
      }
      if (status === "SUCCESS") {
        setTimeout(() => {
          historyStore.updateStatus(address, "SUCCESS");
        }, 1000);
      } else {
        historyStore.updateStatus(address, status);
      }

      historyStore.updateHistory(address, {
        status: status,
        toChainTxHash: result.swapDetails?.destinationChainTxHashes?.[0]?.hash
      });
    }

    window.updateSwapHistoryTimer = setTimeout(() => {
      updateTxns();
    }, 5000);
  };
  useEffect(() => {
    updateTxns();

    return () => {
      clearTimeout(window.updateSwapHistoryTimer);
    };
  }, []);
}
