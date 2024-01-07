import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client';
import get from 'lodash/get';

// NOTE: createdAt is timestamp number
const initialState = {
    conversations: {},
};

export const chatSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        resetMessages: (state, action) => {
            return {
                conversations: {},
            };
        },
        addMessage: (state, action) => {
            let { conversationId, userId, messageContent, createdAt } = action.payload;
            return {
                conversations: {
                    ...state.conversations,
                    [conversationId]: [...get(state.conversations, conversationId, []), { userId, messageContent, createdAt: Date.parse(createdAt) }],
                }
            };
        },
        initMessages: (state, action) => {
            let { conversations } = action.payload;
            let newState = { conversations: {} };
            for (let conversation of conversations) {
                let { id: conversationId, messages } = conversation;
                newState.conversations[conversationId] = [
                    ...get(state.conversations, conversationId, []),
                    ...messages.map(({ fromUser, messageContent, createdAt }) => {
                        return { userId: fromUser.id, messageContent, createdAt: Date.parse(createdAt) };
                    })
                ];
            }
            return newState;
        }
    },
})

export const { resetMessages, addMessage, initMessages } = chatSlice.actions;

export default chatSlice.reducer;
