import { useSelector, useDispatch } from 'react-redux';
import { incomingMessage } from 'slices/chat';
import { connectSocket } from 'slices/socket';
import { ChatMessageModel } from 'types/chat';

export default function SocketIOListener() {
    const socket = useSelector((state: any) => state.socket.socket);
    const accessToken = useSelector((state: any) => state.user.accessToken);
    const dispatch = useDispatch();

    // Recover the chat socket
    if (accessToken && !socket) {
        dispatch(connectSocket({ accessToken }));
    }

    socket?.on('message', (payload: ChatMessageModel) => {
        dispatch(incomingMessage({ message: payload }));
    });

    return (<></>);
}
