import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    accessToken: null,
    avatar: process.env.REACT_APP_DEFAULT_AVATAR_URL,
    refreshToken: null,
    displayName: null,
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        updateToken: (state, action) => {
            return {
                ...state,
                ...action.payload,
            }
        }
    },
})

export const { updateToken } = userSlice.actions;

export default userSlice.reducer;
