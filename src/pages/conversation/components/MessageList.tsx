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
            id="scrollableDiv"
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
                scrollableTarget="scrollableDiv"
                loader={<Typography align="center">Loading messages...</Typography>}
                endMessage={
                    <Typography align="center" sx={{ py: 2 }}>
                        No more messages
                    </Typography>
                }
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
            >
                {messages.map(msg => (
                    <ChatMessage 
                        key={msg.id} 
                        content={msg.content} 
                        userId={msg.fromUser.id} 
                    />
                ))}
            </InfiniteScroll>
        </Box>
    );
}