import { useState } from "react";
import { Message } from "./types";
import MessageList from "./components/MessageList";

const PAGE_SIZE = 20;

let defaultMessages = Array.from(
  { length: PAGE_SIZE },
  (_, idx): Message => ({
    id: "fake-message-id",
    content: `fake-content ${idx + 1}`,
    conversation: { id: "fake-conversation" },
    createdAt: new Date().toISOString(),
    fromUser: { id: "fake-user-id" }
  })
);

export default function Conversation() {
  const [pageNumber, setPageNumber] = useState(0);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [hasMore, setHasMore] = useState(true);

  /**
   * ONLY debug for now
   * @param pageNumber Pagination page-numnber
   * @param limit The expected page size
   * @returns List of messages
   */
  async function fetchOlderMessages(pageNumber: number, limit: number): Promise<Message[]> {
    let mesage = [...defaultMessages];
    return pageNumber >= 5 ? [] : mesage;
  }

  const loadMore = async () => {
    console.log("loadMore message...");

    const older: Message[] = await fetchOlderMessages(pageNumber, PAGE_SIZE);
    setMessages(prev => [...older, ...prev]);
    setPageNumber(prev => prev + 1);
    if (older.length < PAGE_SIZE) setHasMore(false);
  };

  return (
    <div>
      <h1>Conversation</h1>
      <MessageList hasMore={hasMore} loadMore={loadMore} messages={messages} />
    </div>
  );
}