import InfiniteScroll from "react-infinite-scroll-component";
import {ScrollDirection} from "../state";
import {useRef} from "react";

type MessageListProps = {
    changeScrollDirection: (direction: ScrollDirection) => void;
    fetchMore: () => void;
    hasMore: boolean;
    messages: string[];
};

export default function MessageList(props: MessageListProps) {
  const { fetchMore, hasMore, messages, changeScrollDirection } = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  scrollRef.current?.addEventListener("wheel", event => {
    if (event.deltaY < 0) {
      changeScrollDirection("up");
    } else if (event.deltaY > 0) {
      changeScrollDirection("down");
    }
  });

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
        loader={<p style={{ textAlign: "center" }}>Loading...</p>}
        inverse={true}
        scrollableTarget="chatDiv"
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              padding: "8px",
              margin: "4px 0",
              background: "#f1f1f1",
              borderRadius: 4
            }}
          >
            {msg}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}