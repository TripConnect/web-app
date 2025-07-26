import {useCallback, useEffect, useState} from "react";
import MessageList from "./components/MessageList";
import {Message, ScrollDirection} from "./state";

const FETCH_LIMIT = 50;

export default function Conversation() {
  const [fetchMoreType, setFetchMoreType] = useState<"before" | "after">("before");
  const [messages, setMessages] = useState<Message[]>([]);

  const MAX = 500;
  const hasMore = messages.length < MAX;

  useEffect(() => {
    fetchMore();
  }, []);

  const fetchMore = () => {
    setTimeout(() => {
      setMessages(prev => {
        const older: Message[] = Array.from(
          { length: FETCH_LIMIT },
          (_, i): Message => ({
            id: window.self.crypto.randomUUID().toString(),
            content: "Message from " + new Date().toISOString(),
            createdAt: new Date().toISOString(),
            fromUser: {
              id: window.self.crypto.randomUUID(),
            }
          })
        );
        return [...prev, ...older];
      });
    }, 500);
  };

  const changeScrollDirection = useCallback((direction: ScrollDirection) => {
    if(fetchMoreType === "before" && direction === "up") return;
    if(fetchMoreType === "after" && direction === "down") return;

    setFetchMoreType(direction === "up" ? "before" : "after");
  }, [fetchMoreType]);

  return (
    <div>
      <h1>Conversation</h1>
      <MessageList
          changeScrollDirection={changeScrollDirection}
          fetchMore={fetchMore}
          hasMore={hasMore}
          messages={messages} />
    </div>
  );
}