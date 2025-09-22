import InfiniteScroll from "react-infinite-scroll-component";
import {Message, ScrollDirection} from "../state";
import {useEffect, useRef} from "react";
import {useDebounceCallback} from 'usehooks-ts';
import ChatMessage from "./ChatMesasge";

type MessageListProps = {
  changeScrollDirection: (direction: ScrollDirection) => void;
  fetchMore: () => void;
  hasMore: boolean;
  messages: Message[];
};

export default function MessageList(props: MessageListProps) {
  const {fetchMore, hasMore, messages, changeScrollDirection} = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const debouncedWheel = useDebounceCallback(
    (deltaY: number) => {
      if (deltaY < 0) changeScrollDirection('up');
      else if (deltaY > 0) changeScrollDirection('down');
    },
    500
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const listener = (e: WheelEvent) => debouncedWheel(e.deltaY);
    el.addEventListener('wheel', listener);
    return () => {
      el.removeEventListener('wheel', listener);
      debouncedWheel.cancel();
    };
  }, [debouncedWheel]);

  return (
    <div
      id="chatDiv"
      ref={scrollRef}
      style={{
        height: 400,
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        border: "1px solid #ccc",
        padding: 8
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<p style={{textAlign: "center"}}>Loading...</p>}
        inverse={true}
        scrollThreshold={50}
        scrollableTarget="chatDiv"
        style={{display: "flex", flexDirection: "column-reverse"}}
      >
        {messages.map((msg, idx) => <ChatMessage
          key={`${msg.id}`}
          id={msg.id}
          user={msg.fromUser}
          content={msg.content}
          sentTime={msg.sentTime}/>)}
      </InfiniteScroll>
    </div>
  );
}
