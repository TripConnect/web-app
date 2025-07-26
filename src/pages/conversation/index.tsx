import {useCallback, useState} from "react";
import MessageList from "./components/MessageList";
import {ScrollDirection} from "./state";

export default function Conversation() {
  const [fetchMoreType, setFetchMoreType] = useState<"before" | "after">("before");
  const [messages, setMessages] = useState<string[]>(
    Array.from({ length: 10 }, (_, i) => `Message ${i + 1}`)
  );

  const MAX = 50;
  const hasMore = messages.length < MAX;

  const fetchMore = () => {
    // Simulate async fetch: prepend 10 older messages
    setTimeout(() => {
      setMessages(prev => {
        const start = prev.length + 1;
        const end = Math.min(prev.length + 10, MAX);
        const older = Array.from(
          { length: end - prev.length },
          (_, i) => `Message ${start + i}`
        );
        return [...prev, ...older];
      });
    }, 500);
  };

  const changeScrollDirection = useCallback((direction: ScrollDirection) => {
    console.log({direction})
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