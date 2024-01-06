import { configureStore, combineReducers } from '@reduxjs/toolkit';
import chatReducer from './slices/chat';
import userReducer from './slices/user';


const rootReducer = combineReducers({
    chat: chatReducer,
    user: userReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})
