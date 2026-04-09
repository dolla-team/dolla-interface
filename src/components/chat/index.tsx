import clsx from "clsx";
import {
  Realtime,
  TextMessage,
  MessageQueryDirection
} from "leancloud-realtime";
import LC from "leancloud-storage";
import { useEffect, useState, useRef } from "react";
import ChatItem from "./chat-item";
import { useAuth } from '@/contexts/wallet'
import { useDebounceFn } from "ahooks";
import useUsersInfo from "@/hooks/use-users-info";
import { uniqBy } from "lodash-es";

const realtime = new Realtime({
  appId: import.meta.env.VITE_LEANCLOUD_APP_ID!,
  appKey: import.meta.env.VITE_LEANCLOUD_APP_KEY!,
  server: import.meta.env.VITE_LEANCLOUD_SERVER_URL
});

LC.init({
  appId: import.meta.env.VITE_LEANCLOUD_APP_ID!,
  appKey: import.meta.env.VITE_LEANCLOUD_APP_KEY!,
  serverURL: import.meta.env.VITE_LEANCLOUD_SERVER_URL
});

// Chat room ID
const CHAT_ROOM_ID =
  import.meta.env.VITE_LEANCLOUD_ROOM_ID || "67f64d63acc83b7b33b3515c";

export default function Chat({ className }: any) {
  const [messages, setMessages] = useState<TextMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const conversationRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userInfo, accountRefresher } = useAuth();
  const hasMoreRef = useRef(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { fetchUsersInfo, users } = useUsersInfo();
  const fetchHistoryMessages = async () => {
    if (!conversationRef.current) {
      return;
    }

    // https://leancloud.github.io/js-realtime-sdk/docs/ChatRoom.html#queryMessages
    let options: any = {
      limit: 20,
      direction: MessageQueryDirection.NEW_TO_OLD
    };

    if (messages.length > 0) {
      options.endMessageId = messages[0].id;
      options.endTime = messages[0].timestamp;
    }

    const historyMessages = await conversationRef.current.queryMessages(
      options
    );

    hasMoreRef.current = historyMessages.length >= 20;

    const sortedMessages = historyMessages.sort(
      (a: any, b: any) => a.timestamp - b.timestamp
    );

    await fetchUsersInfo(
      sortedMessages.map((message: TextMessage) => message.from)
    );

    setMessages([...sortedMessages, ...messages] as TextMessage[]);
  };

  const { run: fetchHistoryMessagesDebounced } = useDebounceFn(
    (e: any) => {
      const element = e.target as HTMLDivElement;
      if (element.scrollTop < 30 && hasMoreRef.current) {
        fetchHistoryMessages();
      }
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    let client: any;

    realtime
      .createIMClient(String(userInfo?.id || 0))
      .then(async (_client) => {
        client = _client;
        console.log("IM client created successfully");

        try {
          // Try to get the chat room
          const existingConversation = await _client.getConversation(
            CHAT_ROOM_ID
          );
          console.log(
            "Chat room retrieved successfully:",
            existingConversation
          );
          if (!existingConversation) {
            throw new Error("Chat room not found");
          }
          return existingConversation;
        } catch (error) {
          console.error("Failed to get chat room:", error);

          // Create a new chat room if it doesn't exist
          console.log("Attempting to create a new chat room");
          try {
            const newChatRoom = await _client.createChatRoom({
              name: "One Won Chat"
            });
            console.log("New chat room created successfully:", newChatRoom.id);
            return newChatRoom;
          } catch (createError) {
            console.error("Failed to create chat room:", createError);
            throw createError;
          }
        }
      })
      .then(async (chatroom) => {
        conversationRef.current = chatroom;
        console.log("conversationRef.current", conversationRef.current);
        console.log("Chat room connected successfully:", chatroom.id);

        try {
          // Join the chat room
          await chatroom.join();
          console.log("Successfully joined the chat room");
          setIsConnected(true);
          await fetchHistoryMessages();
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          // Listen for new messages
          chatroom.on("message", (message: TextMessage) => {
            console.log("New message received:", message);
            setMessages((prev) => [...prev, message]);
          });

          chatroom.count().then((res: any) => {
            setOnlineUsers(res);
          });

          return chatroom;
        } catch (error) {
          console.error("Failed to join chat room:", error);

          throw error;
        }
      })
      .catch((error) => {
        console.error("Chat room setup error:", error);
      });

    return () => {
      if (client) {
        client.close();
      }
    };
  }, [accountRefresher]);

  const sendMessage = async () => {
    if (
      !conversationRef.current ||
      !inputMessage.trim() ||
      !isConnected ||
      !userInfo
    ) {
      return;
    }

    try {
      console.log("Preparing to send message...");
      const message = new TextMessage(inputMessage);
      console.log("Message object created successfully:", message);

      setMessages((prev) => [...prev, message]);

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      await conversationRef.current.send(message);
      console.log("Message sent successfully");

      setInputMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className={clsx("h-full", className)}>
      <div className="h-[36px] bg-[#191817] p-[12px] rounded-[16px_16px_0_0] flex justify-between items-center text-[#ABABAB] text-[12px]">
        <span>Degen Chat</span>
        <div className="flex items-center gap-[6px]">
          <div className={clsx("w-[8px] h-[8px] rounded-full bg-[#EBFF57]")} />
          <span>{onlineUsers} Online</span>
        </div>
      </div>
      <div
        className="h-[calc(100%-104px)] overflow-y-auto pt-[20px]"
        onScroll={fetchHistoryMessagesDebounced}
      >
        {uniqBy(messages, "id").map((message, index) => (
          <ChatItem key={index} message={message} user={users[message.from]} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="h-[48px] p-[14px] bg-[#191817] rounded-[8px] flex items-center border-[1px] border-[#434343CC]">
        <input
          type="text"
          className="w-full h-full grow bg-[#222222] rounded-[16px] text-[12px] text-white"
          placeholder={
            !userInfo ? "Please connect wallet first" : "Type message here..."
          }
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          disabled={!isConnected || !userInfo}
          value={inputMessage}
        />
        <button
          className="button"
          disabled={!isConnected || !userInfo}
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.8906 2.04246C21.3345 1.35752 20.8151 0.458014 20 0.499949L1.63153 0.941831C0.88539 0.980217 0.443318 1.79348 0.816879 2.44051L3.82433 7.64956L12.4986 4.27078C14.0002 3.49999 14.4986 4.77086 13.5002 5.49985L5.79504 11.0629L9.14256 16.861C9.51612 17.508 10.4415 17.5318 10.8478 16.9049L20.8906 2.04246Z"
              fill="#EBFF57"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
