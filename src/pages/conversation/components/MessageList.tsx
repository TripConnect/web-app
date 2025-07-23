import { Box, Typography } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { Message } from "../types";
import ChatMessage from "./ChatMesasge";

interface MessageListProps {
    messages: Message[]
    loadMore: () => Promise<void>,
    hasMore: boolean
}

export default function MessageList(props: MessageListProps) {
    let { messages, loadMore, hasMore } = props;

    console.table(messages);

    return (
        <Box
            id="chatScrollDiv"
            sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse'
            }}
        >
            <InfiniteScroll
                dataLength={messages.length}
                next={loadMore}
                hasMore={hasMore}
                inverse={true}
                scrollableTarget="chatScrollDiv"
                scrollThreshold={100}
                loader={<Typography align="center">Loading messages...</Typography>}
            >
                {messages.map(msg => <ChatMessage key={msg.id} content={msg.content} userId={msg.fromUser.id} />)}

            </InfiniteScroll>
        </Box>
    );
}