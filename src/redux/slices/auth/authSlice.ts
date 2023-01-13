import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CaseReducer } from '@reduxjs/toolkit/src/createReducer';

import { IUser } from '@src/types/user';

import {
  login,
  logout,
  recallUser,
  registration,
  setAuthLoading,
  verifyRegistration,
} from './asyncThunks/authAthunkThunks';

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

export const setLoading =
  (value: boolean): CaseReducer<IAuthState, PayloadAction<boolean | unknown>> =>
  state => {
    state.isLoading = value;
  };

const authenticateFulfilledReducer: CaseReducer<
  IAuthState,
  PayloadAction<IUser & { token: string }>
> = (state, action) => {
  const { token, ...user } = action.payload;

  state.token = token;
  state.user = user;
  state.isLoading = false;
  state.isAuthenticated = true;
};

const registrationFulfilledReducer: CaseReducer<
  IAuthState,
  PayloadAction<IUser & { token: string }>
> = (state, action) => {
  return {
    ...state,
    user: action.payload,
    isLoading: false,
  };
};

const setInitialState = (state: IAuthState) => ({
  ...state,
  ...initialState,
});

export const authSlice = createSlice({
  extraReducers: builder => {
    builder.addCase(setAuthLoading, (state, action) =>
      setLoading(action.payload)(state, action),
    );
    builder.addCase(recallUser.pending, setLoading(true));
    builder.addCase(recallUser.fulfilled, authenticateFulfilledReducer);
    builder.addCase(recallUser.rejected, setLoading(false));
    builder.addCase(login.fulfilled, authenticateFulfilledReducer);
    builder.addCase(login.pending, setLoading(true));
    builder.addCase(login.rejected, setLoading(false));
    builder.addCase(logout.pending, setLoading(true));
    builder.addCase(logout.rejected, setLoading(false));
    builder.addCase(logout.fulfilled, setInitialState);
    builder.addCase(registration.fulfilled, registrationFulfilledReducer);
    builder.addCase(registration.pending, setLoading(true));
    builder.addCase(registration.rejected, setLoading(false));
    builder.addCase(verifyRegistration.fulfilled, authenticateFulfilledReducer);
    builder.addCase(verifyRegistration.pending, setLoading(true));
    builder.addCase(verifyRegistration.rejected, setLoading(false));
  },
  initialState,
  name: '@auth',
  reducers: {
    clearUser: state => ({ ...state, user: null }),
  },
});

export const authReducer = authSlice.reducer;
