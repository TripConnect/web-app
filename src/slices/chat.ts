import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ChatMessageModel } from 'types/chat';

interface ConversationsState {
    messages: ChatMessageModel[];
}

const initialState: ConversationsState = {
    messages: [],
};

export const chatSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        initChatHistory: (state, action: PayloadAction<{ messages: ChatMessageModel[] }>) => {
            let { messages }: { messages: any } = action.payload;
            state.messages = messages;
        },
        addChatHistory: (state, action: PayloadAction<{ messages: ChatMessageModel[] }>) => {
            let { messages }: { messages: any } = action.payload;
            state.messages.push(...messages);
        },
        incomingMessage: (state, action: PayloadAction<{ message: ChatMessageModel }>) => {
            console.log("Incoming message");
            let { message } = action.payload;
            state.messages.push(message);
        },
    },
})

export const { incomingMessage, addChatHistory, initChatHistory } = chatSlice.actions;

export default chatSlice.reducer;
