import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CaseReducer } from '@reduxjs/toolkit/src/createReducer';

import { IUser } from '@src/types/user';

import {
  loginAction,
  logoutAction,
  recallUserAction,
  requestSignupOtpAction,
  verifySignupOtpCodeAction,
} from '../actions/authActions';

export interface IAuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  verified: boolean;
  user: IUser | null;
}

export const initialState: IAuthState = {
  token: null,
  isLoading: false,
  isAuthenticated: false,
  verified: false,
  user: null,
};

const setLoading =
  (value: boolean): CaseReducer<IAuthState, PayloadAction<boolean | unknown>> =>
  state => {
    state.isLoading = value;
  };

const setUserAuthenticated: CaseReducer<IAuthState> = state => {
  state.isLoading = false;
  state.isAuthenticated = true;
};

const setInitialStateReducer = () => initialState;

export const authenticationSlice = createSlice({
  reducers: {
    updateAuthUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAccessToken: (state, action) => {
      state.token = action.payload;
    },
    setInitialState: setInitialStateReducer,
  },
  extraReducers: builder => {
    builder.addCase(recallUserAction.pending, setLoading(true));
    builder.addCase(recallUserAction.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(recallUserAction.rejected, setLoading(false));

    builder.addCase(loginAction.fulfilled, setUserAuthenticated);
    builder.addCase(loginAction.pending, setLoading(true));
    builder.addCase(loginAction.rejected, setLoading(false));

    builder.addCase(requestSignupOtpAction.fulfilled, setLoading(false));
    builder.addCase(requestSignupOtpAction.pending, setLoading(true));
    builder.addCase(requestSignupOtpAction.rejected, setLoading(false));

    builder.addCase(verifySignupOtpCodeAction.fulfilled, setUserAuthenticated);
    builder.addCase(verifySignupOtpCodeAction.pending, setLoading(true));
    builder.addCase(verifySignupOtpCodeAction.rejected, setLoading(false));

    builder.addCase(logoutAction.pending, setLoading(true));
    builder.addCase(logoutAction.rejected, setLoading(false));
    builder.addCase(logoutAction.fulfilled, setInitialStateReducer);
  },
  initialState,
  name: '@authentication',
});

export const setAuthLoading = authenticationSlice.actions.setLoading;
export const setAccessToken = authenticationSlice.actions.setAccessToken;
export const setAuthInitialState = authenticationSlice.actions.setInitialState;
export const updateAuthUser = authenticationSlice.actions.updateAuthUser;

export const authReducer = authenticationSlice.reducer;
