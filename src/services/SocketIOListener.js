import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, addMessages } from '../slices/chat';


const INIT_CONVERSATION_QUERY = gql`
    query Conversations {
        conversations {
            createdAt
            lastMessageAt
            messages {
                id
                messageContent
                createdAt
                fromUser {
                    id
                }
            }
            id
        }
    }
`;

export default function SocketIOListener() {
    const accessToken = useSelector((state) => state.user.accessToken);
    const conversations = useSelector((state) => state.chat.conversations);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);

    const { loading: initLoading, error: initError, data: initData } = useQuery(INIT_CONVERSATION_QUERY);
    useEffect(() => {
        if (Object.keys(conversations).length) return;
        if (!initLoading && !initError && initData) {
            for (let conversation of initData.conversations) {
                dispatch(addMessages({ conversationId: conversation.id, messages: conversation.messages }));
            }
        }
    }, [initData]);

    if (accessToken && !socket) {
        setSocket(io(
            process.env.REACT_APP_BASE_URL + "/chat",
            {
                transports: ['websocket'], // you need to explicitly tell it to use websockets
                auth: {
                    token: accessToken,
                }
            },
        ));
    }

    if (socket) {
        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('connect_error', err => {
            console.log(err.message);
        });
        socket.on('message', (payload) => {
            let { conversationId, userId, messageContent, createdAt } = payload;
            dispatch(addMessage({ conversationId, userId, messageContent, createdAt }));
            console.log("new message incoming: " + payload);
        });
    }

    return (<></>);
}
