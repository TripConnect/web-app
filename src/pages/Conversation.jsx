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
    query Conversation($id: String!, $page: Int, $limit: Int) {
        conversation(id: $id) {
            messages(page: $page, limit: $limit) {
                messageContent
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
    let [currentConversationId, setCurrentConversationId] = useState(conversationId);
    const conversationMessages = useSelector((state) => state.chat.conversations?.[currentConversationId]);
    const currentUser = useSelector((state) => state.user);
    const [timeoutId, setTimeoutId] = useState(null);
    const [currentPage, setCurrentPage] = useState(-1);
    const [messageContent, setMessage] = useState("");

    const { loading: initLoading, error: initError, data: initData } = useQuery(INIT_CONVERSATION_QUERY, {
        variables: { id: currentConversationId, page: currentPage, limit: 100 },
    });
    const [loadConversation, { loading, error, data }] = useLazyQuery(LOAD_CONVERSATION_QUERY);
    const [searchUser, { loading: searchUSerloading, error: searchUserError, data: searchUserData }] = useLazyQuery(SEARCH_USER_QUERY);

    if (initLoading) return <div>Loading...</div>;
    if (initError) {
        console.error(initError);
        return <div>Something went wrong</div>;
    }
    if (!conversationMessages) return <div>Cannot load messages</div>;

    const handleChangeMessage = e => {
        let { value } = e.target;
        setMessage(value);
    }

    const handleSendMessage = e => {
        dispatch(sendChatMessage({ currentConversationId, messageContent }));
        setMessage("");
    }

    const switchConversation = (conversationId) => {
        setCurrentConversationId(conversationId);
    }

    const handleSearchUserChange = e => {
        clearTimeout(timeoutId);
        if(e.target.value.length === 0) {
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
                        style={{paddingBottom: 12}}
                        onKeyUp={handleSearchUserChange}
                    />
                    <div>
                        {
                            searchUserData?.users && searchUserData.users
                                .map((searchedUser, index) => currentUser.userId !== searchedUser.id && (
                                    <>
                                        <div 
                                            key={`sidebarSearchUser-${searchedUser.id}`}
                                            style={{padding: 10, cursor: "pointer"}}
                                            // onClick={() => switchConversation(newConversationId)}
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
                                .map((m, index) => (
                                    <Message key={`message-${index}`} id={m.id} content={m.messageContent} createdAt={m.createdAt} isSelf={m.userId === currentUser.userId} />
                                ))
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