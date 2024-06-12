import { INCOMING_CHAT_MESSAGE_CHANNEL } from 'constants/common';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectSocket } from 'slices/socket';
import { ChatMessageModel } from 'types/chat';

export default function SocketIOListener() {
    const [incomingChatMessageChannel, setIncomingChatMessageChannel] = useState(new BroadcastChannel(INCOMING_CHAT_MESSAGE_CHANNEL));
    const socket = useSelector((state: any) => state.socket.socket);
    const accessToken = useSelector((state: any) => state.user.accessToken);
    const dispatch = useDispatch();

    // Recover the chat socket
    if (accessToken && !socket) {
        dispatch(connectSocket({ accessToken }));
    }

    socket?.on('message', (payload: ChatMessageModel) => {
        incomingChatMessageChannel.postMessage(payload);
    });

    return (<></>);
}
