import { createSlice } from '@reduxjs/toolkit'
import { SystemLanguage } from 'constants/lang';

const initialState = {
    currentLanguage: SystemLanguage.EN,
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
});

export const { switchLanguage } = languageSlice.actions;

export default languageSlice.reducer;
