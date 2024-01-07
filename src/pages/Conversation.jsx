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
        <div key={id} style={{ alignSelf: isSelf ? "flex-end" : "flex-start" }}>
            <p style={{ margin: "0.1vw 0", border: "solid 0.5px black", borderRadius: "1rem", padding: "0.1vw 0.2vw" }}>{content}</p>
        </div >
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

    console.log({ conversationMessages, currentUserId });
    return (
        <div style={{ width: "50vw", margin: "auto", }}>
            <b>
                {
                    initData?.conversation?.type === "PRIVATE" ?
                        initData?.conversation?.members.find(m => m.id != currentUserId).displayName :
                        initData?.conversation?.name
                }
            </b>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                outline: "solid 1px black",
                padding: "0.5vw",
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