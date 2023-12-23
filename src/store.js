import { configureStore, combineReducers } from '@reduxjs/toolkit';
import socketReducer from './slices/socket';


const rootReducer = combineReducers({
    socket: socketReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})
