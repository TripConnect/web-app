import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    accessToken: null,
    refreshToken: null,
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
