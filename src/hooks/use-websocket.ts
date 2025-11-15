import { useEffect, useRef, useCallback } from "react";
import { wsService, type MessageHandler } from "@/service/ws";
import { useAllMarketsStore } from "@/stores/use-all-markets";
import useBtcDetailStore from "@/stores/use-btc-detail";
import { useAuth } from "@/contexts/auth";

/**
 * Hook for WebSocket subscription
 * @param onMessage - Callback function when message is received
 * @param autoConnect - Whether to connect automatically (default: true)
 * @param stream - Stream name to subscribe to (default: "bid@bidResult")
 */
export default function useWebSocket(
  onMessage?: MessageHandler,
  autoConnect: boolean = true,
  stream: string = "bid@bidResult"
) {
  const handlerRef = useRef<MessageHandler | undefined>(onMessage);
  const { userInfo } = useAuth();

  // Update handler ref when onMessage changes
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  // Create a stable handler that uses the latest onMessage
  const handleMessage = useCallback((data: any) => {
    if (handlerRef.current) {
      handlerRef.current(data);
    }
  }, []);

  useEffect(() => {
    const userId = userInfo?.id;
    if (!autoConnect || !userId) {
      return;
    }

    // Connect and subscribe
    wsService
      .connect()
      .then(() => {
        wsService.addMessageHandler(stream, handleMessage);

        wsService.subscribe([stream, `${userId}@account`], 1);
      })
      .catch((error) => {
        console.error("Failed to connect WebSocket:", error);
      });

    // Cleanup: unsubscribe and remove handler
    return () => {
      wsService.removeMessageHandler(stream, handleMessage);
      // Note: We don't disconnect here to allow other components to use the same connection
      // If you want to disconnect when no handlers remain, you can add that logic
    };
  }, [autoConnect, stream, handleMessage, userInfo?.id]);

  // Manual connect function
  const connect = useCallback(async () => {
    try {
      await wsService.connect();
      wsService.addMessageHandler(stream, handleMessage);
      wsService.subscribe([stream, `1@account`], 1);
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      throw error;
    }
  }, [stream, handleMessage]);

  // Manual disconnect function
  const disconnect = useCallback(() => {
    wsService.removeMessageHandler(stream, handleMessage);
    wsService.unsubscribe([stream], 1);
  }, [stream, handleMessage]);

  // Get connection status
  const isConnected = wsService.getConnectionStatus();

  return {
    connect,
    disconnect,
    isConnected
  };
}

/**
 * Hook specifically for bid result subscription
 * @param onMessage - Callback function when message is received
 * @param stream - Stream name to subscribe to (default: "bid@bidResult")
 */
export function useBidResultSubscription() {
  const allMarketsStore = useAllMarketsStore();
  const btcDetailStore = useBtcDetailStore();
  // Subscribe to WebSocket bid result updates
  useWebSocket((data: any) => {
    console.log("data", data);
    if (data.type === "bidResult") {
      if (!data?.data?.length) return;
      data.data.forEach((item: any) => {
        if (!item?.pool_id) return;
        const poolId = item.pool_id;
        const currentPool = allMarketsStore.pools[poolId];
        if (currentPool) {
          // Update pool data with new bid result
          allMarketsStore.set({
            pools: {
              ...allMarketsStore.pools,
              [poolId]: {
                ...currentPool,
                ...item // Merge new data into existing pool data
              }
            }
          });
        }
      });
      return;
    }

    if (
      data.type === "bidAccountResult" &&
      btcDetailStore.currentHash === data.data?.tx_hash
    ) {
      btcDetailStore.set({
        bidResult: data.data,
        currentHash: "",
        flipStatus: btcDetailStore.bids === 1 ? 5 : 4
      });
    }
  });
}
