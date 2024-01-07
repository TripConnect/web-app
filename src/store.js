import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import chatReducer from './slices/chat';
import userReducer from './slices/user';

// Define your root reducer
const rootReducer = combineReducers({
    chat: chatReducer,
    user: userReducer,
});

// Configure redux-persist
const persistConfig = {
    key: 'root',
    storage,
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

// Create the persistor
export const persistor = persistStore(store);
