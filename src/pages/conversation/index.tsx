import { useState } from "react";
import { Message } from "./state";
import MessageList from "./components/MessageList";


export default function Conversation() {
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

  return (
    <div>
      <h1>Conversation</h1>
      <MessageList
          fetchMore={fetchMore}
          hasMore={hasMore}
          messages={messages}
          messageLength={messages.length} />
    </div>
  );
}