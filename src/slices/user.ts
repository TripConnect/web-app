import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type UserState = {
    userId: string | null,
    avatar: string | null,
    displayName: string | null,
    accessToken: string | null,
    refreshToken: string | null,
}

const initialState: UserState = {
    userId: null,
    avatar: process.env.REACT_APP_DEFAULT_AVATAR_URL as string,
    displayName: null,
    accessToken: null,
    refreshToken: null,
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        updateToken: (state, action: PayloadAction<UserState>): UserState => {
            return {
                ...state,
                ...action.payload,
            }
        }
    },
});

export const { updateToken } = userSlice.actions;

export default userSlice.reducer;
