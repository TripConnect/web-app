import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../slices/socket';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect } from 'react';

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
    const socket = useSelector((state) => state?.socket?.connection);
    const dispatch = useDispatch()

    const { loading: initLoading, error: initError, data: initData } = useQuery(INIT_CONVERSATION_QUERY);
    useEffect(() => {
        if (!initLoading && !initError && initData) {
            for (let conversation of initData.conversations) {
                for (let message of conversation.messages) {
                    console.log({ message });
                    dispatch(addMessage({
                        conversationId: conversation.id,
                        userId: message.fromUser.id,
                        messageContent: message.messageContent,
                        createdAt: message.createdAt
                    }));
                }
            }
        }
    }, [initData]);

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
