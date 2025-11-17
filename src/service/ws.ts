import { WS_URL } from "@/config";

// WebSocket service for bid result subscription
export interface SubscribeMessage {
  method: "SUBSCRIBE" | "UNSUBSCRIBE";
  params: string[];
  id: number;
}

export interface BidResultMessage {
  stream: string;
  data: any;
}

export type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private isConnecting = false;
  private isConnected = false;
  private subscribeQueue: SubscribeMessage[] = [];
  // Ping/Pong related
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private pingIntervalMs = 30000; // 30 seconds
  private pongTimeoutMs = 10000; // 10 seconds timeout for pong response
  private lastPongTime: number = 0;

  constructor(url: string = WS_URL) {
    this.url = url;
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.isConnected) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.isConnecting = false;
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.lastPongTime = Date.now();

          // Process queued subscriptions
          this.subscribeQueue.forEach((msg) => {
            this.sendMessage(msg);
          });
          this.subscribeQueue = [];

          // Start ping/pong mechanism
          // this.startPingPong();

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle pong response
            if (data.pong || data.method === "pong") {
              this.handlePong();
              return;
            }

            // Handle regular messages
            // Check if message has stream field (format: { stream: "bid@bidResult", data: {...} })
            if (data.stream && data.data !== undefined) {
              const message: BidResultMessage = data;
              this.handleMessage(message);
            } else {
              // If message doesn't have stream field, try to find handlers for subscribed streams
              // and pass the entire message as data
              console.log(
                "Message without stream field, checking all handlers"
              );
              this.messageHandlers.forEach((handlers, stream) => {
                handlers.forEach((handler) => {
                  try {
                    handler(data);
                  } catch (error) {
                    console.error(
                      `Error in message handler for ${stream}:`,
                      error
                    );
                  }
                });
              });
            }
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.isConnecting = false;
          if (!this.isConnected) {
            reject(error);
          }
        };

        this.ws.onclose = () => {
          console.log("WebSocket disconnected");
          this.isConnected = false;
          this.isConnecting = false;
          this.stopPingPong();
          this.attemptReconnect();
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Subscribe to a stream
  subscribe(params: string[], id: number = 1): void {
    const message: SubscribeMessage = {
      method: "SUBSCRIBE",
      params,
      id
    };

    if (this.isConnected && this.ws) {
      this.sendMessage(message);
    } else {
      // Queue subscription if not connected yet
      this.subscribeQueue.push(message);
      if (!this.isConnecting) {
        this.connect().catch((error) => {
          console.error("Failed to connect for subscription:", error);
        });
      }
    }
  }

  // Unsubscribe from a stream
  unsubscribe(params: string[], id: number = 1): void {
    const message: SubscribeMessage = {
      method: "UNSUBSCRIBE",
      params,
      id
    };

    if (this.isConnected && this.ws) {
      this.sendMessage(message);
    }
  }

  // Add message handler for a specific stream
  addMessageHandler(stream: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(stream)) {
      this.messageHandlers.set(stream, new Set());
    }
    this.messageHandlers.get(stream)!.add(handler);
  }

  // Remove message handler for a specific stream
  removeMessageHandler(stream: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(stream);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(stream);
      }
    }
  }

  // Remove all handlers for a specific stream
  removeAllHandlers(stream: string): void {
    this.messageHandlers.delete(stream);
  }

  // Handle incoming messages
  private handleMessage(message: BidResultMessage): void {
    const { stream, data } = message;
    const handlers = this.messageHandlers.get(stream);

    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in message handler for ${stream}:`, error);
        }
      });
    }
  }

  // Send message to WebSocket server
  private sendMessage(message: SubscribeMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected, message not sent:", message);
    }
  }

  // Attempt to reconnect
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    if (this.reconnectTimer) {
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, delay);
  }

  // Start ping/pong mechanism
  private startPingPong(): void {
    this.stopPingPong();

    // Send initial ping
    this.sendPing();

    // Set up interval to send ping periodically
    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, this.pingIntervalMs);
  }

  // Stop ping/pong mechanism
  private stopPingPong(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  // Send ping message
  private sendPing(): void {
    if (!this.isConnected || !this.ws) {
      return;
    }

    const pingMessage = {
      method: "ping",
      id: Date.now()
    };

    try {
      this.ws.send(JSON.stringify(pingMessage));

      // Set timeout to check if pong is received
      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
      }

      this.pongTimeout = setTimeout(() => {
        const timeSinceLastPong = Date.now() - this.lastPongTime;
        if (timeSinceLastPong > this.pingIntervalMs + this.pongTimeoutMs) {
          console.warn("Pong timeout, reconnecting...");
          if (this.ws) {
            this.ws.close();
          }
        }
      }, this.pongTimeoutMs);
    } catch (error) {
      console.error("Failed to send ping:", error);
    }
  }

  // Handle pong response
  private handlePong(): void {
    this.lastPongTime = Date.now();
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.stopPingPong();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.subscribeQueue = [];
    this.messageHandlers.clear();
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();

// Export class for custom instances
export default WebSocketService;
