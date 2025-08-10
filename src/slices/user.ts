import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type UserState = {
    userId?: string,
    avatar?: string,
    displayName?: string,
    accessToken?: string,
    refreshToken?: string,
}

const initialState: UserState = {};

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
