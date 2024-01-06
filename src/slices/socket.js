import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';
import get from 'lodash/get';


const initialState = {
    connection: null,
    conversations: {},
};

export const socketSlice = createSlice({
    name: 'socketSlice',
    initialState,
    reducers: {
        setConnection: (state, action) => {
            let { accessToken } = action.payload;
            const socket = io(
                process.env.REACT_APP_BASE_URL + "/chat",
                {
                    transports: ['websocket'], // you need to explicitly tell it to use websockets
                    auth: {
                        token: accessToken,
                    }
                },
            );

            return {
                ...action,
                connection: socket,
            };
        },
        sendMessage: (state, action) => {
            console.log({ action, state });
            let { conversationId, messageContent } = action.payload;
            state.connection.emit("message", { conversationId, messageContent });
            return {
                connection: state.connection,
                conversations: { ...state.conversations },
            };
        },
        addMessage: (state, action) => {
            let { conversationId, userId, messageContent, createdAt } = action.payload;
            return {
                connection: state.connection,
                conversations: {
                    ...state.conversations,
                    [conversationId]: get(state.conversations, conversationId, [])
                        .concat({ conversationId, userId, messageContent, createdAt })
                }
            };
        },
    },
})

export const { setConnection, sendMessage, addMessage } = socketSlice.actions;

export default socketSlice.reducer;
