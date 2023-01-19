import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IUser } from '@src/types/user';
import { authApi } from '@src/api/axiosAPI';
import {
  ACCESS_TOKEN_KEY,
  USER_ID_KEY,
  REFRESH_TOKEN_KEY,
} from '@src/constants/asyncStorage';
import { TimerName } from '@src/enums/timer';
import {
  ILoginActionParams,
  IRegistrationActionParams,
  VerifyOtpCodeParams,
} from '@src/types/request';

import { setAccessToken } from '../slices/authenticationSlice';

export const recallUserAction = createAsyncThunk<IUser, { userId: string }>(
  '@auth/recallUser',
  async ({ userId }, { rejectWithValue }) => {
    try {
      return await authApi.recallUser({ id: userId });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const loginAction = createAsyncThunk<void, ILoginActionParams>(
  '@auth/login',
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      const { id, token, refreshToken } = await authApi.login({
        username,
        password,
      });

      await AsyncStorage.setItem(USER_ID_KEY, id);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      await dispatch(setAccessToken(token));
      await dispatch(recallUserAction({ userId: id }));
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const requestSignupOtpAction = createAsyncThunk<
  void,
  IRegistrationActionParams
>(
  '@authentication/requestSignupOtp',
  async ({ username, password, email }, { rejectWithValue }) => {
    try {
      await authApi.registration({
        username,
        password,
        email,
      });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const verifySignupOtpCodeAction = createAsyncThunk<
  void,
  VerifyOtpCodeParams
>(
  '@authentication/verifySignupOtpCode',
  async ({ email, otp }, { rejectWithValue, dispatch }) => {
    try {
      const { refreshToken, token, id } = await authApi.verifyRegistration({
        email,
        otp,
      });

      await AsyncStorage.removeItem(TimerName.RegistrationCode);

      await AsyncStorage.setItem(USER_ID_KEY, id);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      await dispatch(setAccessToken(token));
      await dispatch(recallUserAction({ userId: id }));
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const logoutAction = createAsyncThunk(
  '@authentication/logout',
  async () => {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      await authApi.revokeToken({ refreshToken });
    }

    await AsyncStorage.removeItem(USER_ID_KEY);
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },
);
