import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, initMessages, resetMessages } from 'slices/chat';
import { setConnection } from 'slices/connection';

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
    const socketIOSonnection = useSelector((state) => state.connection.connections.socketio);
    const dispatch = useDispatch();

    const { loading: initLoading, error: initError, data: initData } = useQuery(INIT_CONVERSATION_QUERY);
    useEffect(() => {
        dispatch(resetMessages());
        if (!initLoading && !initError && initData) {
            dispatch(initMessages({ conversations: initData.conversations }));
        }
    }, [initData]);

    if (accessToken && !socketIOSonnection) {
        console.log("Initial socketIO connection");
        let connection = io(
            `${process.env.REACT_APP_BASE_URL}/chat`,
            {
                transports: ['websocket'], // you need to explicitly tell it to use websockets
                auth: {
                    token: accessToken,
                }
            },
        );
        connection.on('connect', () => {
            console.log('connected');
        });
        connection.on('connect_error', err => {
            console.log(err.message);
        });
        connection.on('message', (payload) => {
            let { conversationId, userId, messageContent, createdAt } = payload;
            dispatch(addMessage({ conversationId, userId, messageContent, createdAt }));
        });
        dispatch(setConnection({ name: "socketio", connection }));
    }

    return (<></>);
}
