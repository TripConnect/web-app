import { useLocation } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "slices/connection";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

const INIT_CONVERSATION_QUERY = gql`
    query Conversation($id: String!, $page: Int!, $limit: Int!) {
        conversation(id: $id) {
            name
            type
            messages(page: $page, limit: $limit) {
                id
                fromUser {
                    id
                }
                messageContent
                createdAt
            }
            members {
                id
                displayName
            }
        }
    }
`;

const LOAD_CONVERSATION_QUERY = gql`
    query Conversation($id: String!, $page: Int!, $limit: Int!) {
        conversation(id: $id) {
            messages(page: $page, limit: $limit) {
                messageContent
                createdAt
            }
        }
    }
`;

function Message({ id, content, createdAt, isSelf }) {
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
    const dispatch = useDispatch();
    const location = useLocation();
    let { conversationId } = location.state;
    const conversationMessages = useSelector((state) => state.chat.conversations?.[conversationId]);
    const currentUser = useSelector((state) => state.user);

    const [currentPage, setCurrentPage] = useState(-1);
    const [messageContent, setMessage] = useState("");
    const { loading: initLoading, error: initError, data: initData } = useQuery(INIT_CONVERSATION_QUERY, {
        variables: { id: conversationId, page: currentPage, limit: 100 },
    });
    const [loadConversation, { loading, error, data }] = useLazyQuery(LOAD_CONVERSATION_QUERY);

    if (initLoading) return <div>Loading...</div>;
    if (initError) return <div>Something went wrong</div>;
    if (!conversationMessages) return <div>Cannot load messages</div>;

    const handleChangeMessage = e => {
        let { value } = e.target;
        setMessage(value);
    }

    const handleSendMessage = e => {
        dispatch(sendChatMessage({ conversationId, messageContent }));
        setMessage("");
    }

    return (
        <Container>
            <Grid container>
                <Grid item xs={4} style={{
                    background: "#eee",
                    padding: 10,
                }}>
                    <Typography variant="h1" style={{
                        fontWeight: 500,
                        fontSize: '1.75rem',
                    }}>
                        {currentUser.displayName}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h1" style={{
                        fontWeight: 500,
                        fontSize: '1.5rem',
                        padding: 10,
                    }}>
                        {
                            initData?.conversation?.type === "PRIVATE" ?
                                initData?.conversation?.members.find(m => m.id != currentUser.userId).displayName :
                                initData?.conversation?.name
                        }
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
                        {
                            Array.from(conversationMessages)
                                .sort((a, b) => a.createdAt - b.createdAt)
                                .map((m, index) => <Message key={`message-${index}`} id={m.id} content={m.messageContent} createdAt={m.createdAt} isSelf={m.userId === currentUser.userId} />)
                        }
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
                            value={messageContent}
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