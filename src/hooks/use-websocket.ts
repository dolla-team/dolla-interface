import { useEffect, useRef, useCallback } from "react";
import { wsService, type MessageHandler } from "@/service/ws";

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
    if (!autoConnect) {
      return;
    }

    // Connect and subscribe
    wsService
      .connect()
      .then(() => {
        wsService.addMessageHandler(stream, handleMessage);
        wsService.subscribe([stream], 1);
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
  }, [autoConnect, stream, handleMessage]);

  // Manual connect function
  const connect = useCallback(async () => {
    try {
      await wsService.connect();
      wsService.addMessageHandler(stream, handleMessage);
      wsService.subscribe([stream], 1);
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
export function useBidResultSubscription(
  onMessage?: MessageHandler,
  stream: string = "bid@bidResult"
) {
  return useWebSocket(onMessage, true, stream);
}
