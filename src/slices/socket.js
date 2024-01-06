import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';
import cloneDeep from 'lodash/cloneDeep';


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
            return { ...state };
        },
        addMessage: (state, action) => {
            let newState = {
                ...state,
                conversations: cloneDeep(state.conversations),
            }
            let { conversationId, userId, messageContent, createdAt } = action.payload;
            if (!newState.conversations.hasOwnProperty(conversationId)) {
                newState.conversations[conversationId] = [];
            }
            newState.conversations[conversationId].push({
                conversationId, messageContent, createdAt, userId
            });
            return newState;
        },
    },
})

export const { setConnection, sendMessage, addMessage } = socketSlice.actions;

export default socketSlice.reducer;
