import { store } from 'store';

export const getCurrentUser = () => store.getState().user;
