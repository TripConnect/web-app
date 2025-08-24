import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type UserState = {
  userId?: string,
  avatar?: string,
  displayName?: string,
}

const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    updateInfo: (state, action: PayloadAction<UserState>): UserState => {
      return {
        ...state,
        ...action.payload,
      }
    },
    signedOut: (): UserState => {
      return initialState;
    }
  },
});

export const {updateInfo, signedOut} = userSlice.actions;

export default userSlice.reducer;
