import { useLocation } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, sendMessage } from "../slices/socket";

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

function Message({ content, isSelf }) {
    return (
        <div style={{ alignSelf: isSelf ? "flex-end" : "flex-start" }}>
            {content}
        </div >
    );
}

export default function Conversation() {
    const dispatch = useDispatch();
    const location = useLocation();
    let { conversationId } = location.state;
    const conversationState = useSelector((state) => state?.socket?.conversations);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const [currentPage, setCurrentPage] = useState(-1);
    const [messageContent, setMessage] = useState("");
    const { loading: initLoading, error: initError, data: initData } = useQuery(INIT_CONVERSATION_QUERY, {
        variables: { id: conversationId, page: currentPage, limit: 100 },
    });
    const [loadConversation, { loading, error, data }] = useLazyQuery(LOAD_CONVERSATION_QUERY);

    if (initLoading) return <div>Loading...</div>;
    if (initError) return <div>Something went wrong</div>;

    const handleChangeMessage = e => {
        let { value } = e.target;
        setMessage(value);
    }

    const handleSendMessage = e => {
        dispatch(sendMessage({ conversationId, messageContent }));
        setMessage("");
    }

    console.log({ conversationState });

    return (
        <div>
            <b>
                {
                    initData?.conversation?.type === "PRIVATE" ?
                        initData?.conversation?.members.find(m => m.id != currentUser.id).displayName :
                        initData?.conversation?.name
                }
            </b>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}>
                {
                    conversationState[conversationId] && conversationState[conversationId].map(m => <Message content={m.messageContent} isSelf={m.userId === currentUser.id} />)
                }
            </div>
            <div>
                <input type="text" value={messageContent} onChange={handleChangeMessage} />
                <button type="button" onClick={handleSendMessage} style={{ cursor: "pointer" }}>Send</button>
            </div>
        </div>
    );
}