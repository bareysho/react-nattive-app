import { RootState } from '@src/redux/store/store';

export const selectAuthState = (state: RootState) => state.auth;
