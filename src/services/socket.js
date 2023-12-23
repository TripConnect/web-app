import { useSelector, useDispatch } from 'react-redux';

export default function SocketIOListener() {
    const socket = useSelector((state) => state?.socket?.socket);
    const dispatch = useDispatch()
    if (socket) {
        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('connect_error', err => {
            console.log(err.message);
        });
        socket.on('chat', data => {
            let { conversationId, content, fromUserId, toUserId } = data;
        });
    }

    return (<></>);
}
