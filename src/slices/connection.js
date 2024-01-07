import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    connections: {
        socketio: null,
    },
};

export const connectionSlice = createSlice({
    name: 'connectionSlice',
    initialState,
    reducers: {
        setConnection: (state, action) => {
            let { name, connection } = action.payload;
            return {
                connections: {
                    ...state.connections,
                    [name]: connection,
                }
            }
        },
        sendChatMessage: (state, action) => {
            let { conversationId, messageContent } = action.payload;
            state.connections.socketio.emit("message", { conversationId, messageContent });
            return state;
        },
    },
})

export const { setConnection, sendChatMessage } = connectionSlice.actions;

export default connectionSlice.reducer;
