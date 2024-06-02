// src/store/slices/socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

interface SocketState {
    socket: Socket | null | any;
}

interface ConnectSocketPayload {
    accessToken: string;
}

const initialState: SocketState = {
    socket: null,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectSocket: (state, action: PayloadAction<ConnectSocketPayload>) => {
            console.log("Initial chat socket");
            let { accessToken } = action.payload;
            let connection: Socket = io(
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
            state.socket = connection;
        },
        disconnectSocket: (state) => {
            state.socket?.disconnect();
            state.socket = null;
        },
    },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
