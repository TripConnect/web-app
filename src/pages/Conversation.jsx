import { useLocation } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../slices/connection";

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
            boxSizing: "border-box",
            alignSelf: isSelf ? "flex-end" : "flex-start",
            background: isSelf ? "lightblue" : "lightpink",
            borderRadius: "1rem",
            margin: "0.1vw 0",
            padding: "0.15vw 0.2vw",
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
    const currentUserId = useSelector((state) => state.user.userId);

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

    console.log({ conversationMessages });
    return (
        <div style={{
            position: "relative",
            height: "100vh",
            width: "50vw",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "0.5% 25%",
        }}>
            <div style={{ position: "fixed", top: 0 }}>
                <b>
                    {
                        initData?.conversation?.type === "PRIVATE" ?
                            initData?.conversation?.members.find(m => m.id != currentUserId).displayName :
                            initData?.conversation?.name
                    }
                </b>
            </div>
            <div style={{
                boxSizing: "border-box",
                display: "flex",
                margin: "5% 0",
                height: "50%",
                width: "100%",
                overflow: "auto",
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: "0.5vw",
                border: "solid 1px black",
            }}>
                {
                    Array.from(conversationMessages)
                        .sort((a, b) => a.createdAt - b.createdAt)
                        .map((m, index) => <Message key={`message-${index}`} id={m.id} content={m.messageContent} createdAt={m.createdAt} isSelf={m.userId === currentUserId} />)
                }
            </div>
            <div>
                <input type="text" value={messageContent} onChange={handleChangeMessage} />
                <button type="button" onClick={handleSendMessage} style={{ cursor: "pointer" }}>Send</button>
            </div>
        </div>
    );
}