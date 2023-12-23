import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';

const initialState = { connection: null };

export const socketSlice = createSlice({
    name: 'socketSlice',
    initialState,
    reducers: {
        setConnection: (state, action) => {
            let { accessToken } = action.payload;
            const socket = io(
                process.env.REACT_APP_BASE_URL,
                {
                    transports: ['websocket'], // you need to explicitly tell it to use websockets
                    auth: {
                        token: accessToken,
                    }
                },
            );

            return {
                connection: socket
            };
        },
    },
})

export const { setConnection } = socketSlice.actions;

export default socketSlice.reducer;
