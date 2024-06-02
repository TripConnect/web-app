import { useLocation, useParams } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { addChatHistory, initChatHistory } from "slices/chat";
import { CHAT_MESSAGE_EVENT } from "constants/socket";
import { ChatMessageModel } from 'types/chat';
import { CHAT_HISTORY_PAGE_SIZE } from "constants/common";

const QUERY_CONVERSATION_SUMMARY = gql`
    query Conversation($id: String!) {
        conversation(id: $id) {
            name
            type
            members {
                id
                displayName
            }
        }
    }
`;

const QUERY_CHAT_HISTORY = gql`
    query Conversation($id: String!, $page: Int, $limit: Int) {
        conversation(id: $id) {
            messages(page: $page, limit: $limit) {
                id
                messageContent
                fromUser {
                    id
                    avatar
                    displayName
                }
                createdAt
            }
        }
    }
`;

const SEARCH_USER_QUERY = gql`
    query Users($searchTerm: String!) {
        users(searchTerm: $searchTerm) {
            id
            displayName
        }
    }
`;

function Message({ id, content, createdAt, isSelf }: { id: string, content: string, createdAt: number, isSelf: boolean }) {
    return (
        <div key={id} style={{
            minWidth: "3%",
            maxWidth: "75%",
            boxSizing: "border-box",
            alignSelf: isSelf ? "flex-end" : "flex-start",
            background: isSelf ? "lightblue" : "lightgray",
            borderRadius: "1rem",
            wordWrap: "break-word",
            margin: "0.1vw 0",
            padding: "0.15rem 1rem",
        }}>
            <span>{content}</span>
        </div>
    );
}

export default function Conversation() {
    const { id: currentConversationId } = useParams<{id: string}>();
    const dispatch = useDispatch();

    const [timeoutId, setTimeoutId] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(-1);
    const [chatMessage, setChatMessage] = useState("");

    const chatSocket = useSelector((state: any) => state.socket.socket);
    const currentUser = useSelector((state: any) => state.user);

    const [searchUser, { loading: searchUSerloading, error: searchUserError, data: searchUserData }] = useLazyQuery(SEARCH_USER_QUERY);
    const [fetchChatSummary, { loading: fetchChatSummaryLoading, error: fetchChatSummaryError, data: fetchChatSummaryData }] = useLazyQuery(QUERY_CONVERSATION_SUMMARY);
    const [fetchChatHistory, { loading: fetchChatHistoryLoading, error: fetchChatHistoryError, data: fetchChatHistoryData }] = useLazyQuery(QUERY_CHAT_HISTORY);


    useEffect(() =>{
        fetchChatHistory({
            variables: {
                id: currentConversationId,
                page: currentPage,
                limit: CHAT_HISTORY_PAGE_SIZE
            }
        }).then(data => {
            let messages: ChatMessageModel[] = data.data.conversation.messages.map((m: any) => ({
                conversationId: m.id,
                fromUserId: m.fromUser.id,
                messageContent: m.messageContent,
                createdAt: m.createdAt,
            }));
            dispatch(initChatHistory({ messages }));
        });
    }, [currentPage]);

    useEffect(() =>{
        fetchChatSummary({
            variables: {
                id: currentConversationId
            }
        });
    }, []);


    const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(e.target.value);
    }

    const handleSendMessage = () => {
        chatSocket.emit(CHAT_MESSAGE_EVENT, {
            conversationId: currentConversationId,
            content: chatMessage
        });
        setChatMessage("");
    }

    const handleSearchUserChange = (e: any) => {
        clearTimeout(timeoutId as number);
        if (e.target.value.length === 0) {
            return;
        }
        setTimeoutId(
            setTimeout(() => {
                searchUser({ variables: { searchTerm: e.target.value } });
            }, 800)
        );
    }


    return (
        <Container>
            <Grid container>
                {/* Sidebar */}
                <Grid item xs={4} style={{
                    background: "#eee",
                    padding: 10,
                }}>
                    <Typography variant="h1" style={{
                        fontWeight: 600,
                        fontSize: '1.75rem',
                        marginBottom: 10,
                    }}>Messages</Typography>
                    <Typography variant="h4" component={"div"} style={{
                        fontWeight: 500,
                        fontSize: '1.75rem',
                    }}>
                        {currentUser.displayName}
                    </Typography>
                    <TextField
                        label="Find user"
                        id="find-user"
                        variant="filled"
                        size="small"
                        style={{ paddingBottom: 12 }}
                        onKeyUp={handleSearchUserChange}
                    />
                    <div>
                        {
                            searchUserData?.users && searchUserData.users
                                .map((searchedUser: any, index: number) => currentUser.userId !== searchedUser.id && (
                                    <>
                                        <div
                                            key={`sidebarSearchUser-${searchedUser.id}`}
                                            style={{ padding: 10, cursor: "pointer" }}
                                        >
                                            {searchedUser.displayName}
                                        </div>
                                        {index < searchUserData.users.length - 1 && <hr />}
                                    </>
                                ))
                        }
                    </div>
                </Grid>

                {/* Main */}
                <Grid item xs={8}>
                    <Typography variant="h1" style={{
                        fontWeight: 500,
                        fontSize: '1.5rem',
                        padding: 10,
                    }}>
                        {fetchChatSummaryLoading && "Loading..."}
                        {fetchChatSummaryData && (fetchChatSummaryData.conversation.type === "PRIVATE" ? fetchChatSummaryData.conversation.members.find((m: any) => m.id !== currentUser.userId).displayName : fetchChatSummaryData.conversation.name)}
                    </Typography>

                    <div style={{
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: 'column',
                        width: "100%",
                        height: "80vh",
                        overflow: "auto",
                        alignItems: 'flex-start',
                        padding: "0.5vw",
                        borderTop: "1px solid black",
                        borderBottom: "1px solid black",
                    }}>
                        {fetchChatHistoryLoading && "Loading..."}
                        {fetchChatHistoryData && fetchChatHistoryData.conversation.messages
                            .map((message: any) => <Message key={message.id} id={message.id} content={message.messageContent} createdAt={message.createdAt} isSelf={message.fromUser.id === currentUser.userId} />)}
                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#eee",
                        padding: 20,
                    }}>
                        <TextField
                            label="Message"
                            id="filled-hidden-label-small"
                            variant="filled"
                            size="small"
                            value={chatMessage}
                            onChange={handleChangeMessage}
                            style={{ width: "85%" }}
                        />
                        <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>Send</Button>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}