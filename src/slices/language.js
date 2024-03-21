import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentLanguage: 'en',
};

export const languageSlice = createSlice({
    name: 'languageSlice',
    initialState,
    reducers: {
        switchLanguage: (state, action) => {
            return {
                currentLanguage: action.payload.language,
            }
        }
    },
})

export const { switchLanguage } = languageSlice.actions;

export default languageSlice.reducer;
