import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CaseReducer } from '@reduxjs/toolkit/src/createReducer';

import { IUser, IUserWithToken } from '@src/types/user';

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

const authenticateFulfilledReducer: CaseReducer<
  IAuthState,
  PayloadAction<IUserWithToken>
> = (state, action) => {
  const { token, ...user } = action.payload;

  state.token = token;
  state.user = user;
  state.isLoading = false;
  state.isAuthenticated = true;
};

const registrationFulfilledReducer: CaseReducer<
  IAuthState,
  PayloadAction<IUserWithToken>
> = (state, action) => {
  state.user = action.payload;
  state.isLoading = false;
};

const setInitialState = () => initialState;

export const authenticationSlice = createSlice({
  reducers: {
    clearUser: state => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(recallUserAction.pending, setLoading(true));
    builder.addCase(recallUserAction.fulfilled, authenticateFulfilledReducer);
    builder.addCase(recallUserAction.rejected, setLoading(false));
    builder.addCase(loginAction.fulfilled, authenticateFulfilledReducer);
    builder.addCase(loginAction.pending, setLoading(true));
    builder.addCase(loginAction.rejected, setLoading(false));
    builder.addCase(logoutAction.pending, setLoading(true));
    builder.addCase(logoutAction.rejected, setLoading(false));
    builder.addCase(logoutAction.fulfilled, setInitialState);
    builder.addCase(
      requestSignupOtpAction.fulfilled,
      registrationFulfilledReducer,
    );
    builder.addCase(requestSignupOtpAction.pending, setLoading(true));
    builder.addCase(requestSignupOtpAction.rejected, setLoading(false));
    builder.addCase(
      verifySignupOtpCodeAction.fulfilled,
      authenticateFulfilledReducer,
    );
    builder.addCase(verifySignupOtpCodeAction.pending, setLoading(true));
    builder.addCase(verifySignupOtpCodeAction.rejected, setLoading(false));
  },
  initialState,
  name: '@authentication',
});

export const setAuthLoading = authenticationSlice.actions.setLoading;

export const authReducer = authenticationSlice.reducer;
