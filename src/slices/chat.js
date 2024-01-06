import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';
import get from 'lodash/get';


const initialState = {
    conversations: {},
};

export const socketSlice = createSlice({
    name: 'socketSlice',
    initialState,
    reducers: {
        sendMessage: (state, action) => {
            console.log({ action, state });
            let { conversationId, messageContent } = action.payload;
            state.connection.emit("message", { conversationId, messageContent });
            return {
                conversations: { ...state.conversations },
            };
        },
        addMessage: (state, action) => {
            let { conversationId, userId, messageContent, createdAt } = action.payload;
            return {
                conversations: {
                    ...state.conversations,
                    [conversationId]: get(state.conversations, conversationId, [])
                        .concat({ userId, messageContent, createdAt })
                }
            };
        },
        addMessages: (state, action) => {
            let { conversationId, messages } = action.payload;
            return {
                conversations: {
                    ...state.conversations,
                    [conversationId]: get(state.conversations, conversationId, [])
                        .concat(messages),
                }
            }
        }
    },
})

export const { setConnection, sendMessage, addMessage, addMessages } = socketSlice.actions;

export default socketSlice.reducer;
