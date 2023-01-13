import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IUserWithToken } from '@src/types/user';
import { authApi, userApi } from '@src/api/axiosAPI';
import { USER_KEY } from '@src/constants/asyncStorage';
import { getStorageUser, removeStorageUser } from '@src/utils/asyncStorage';
import { TimerName } from '@src/enums/timer';
import { delay } from '@src/utils/common';
import {
  ILoginActionParams,
  IRegistrationActionParams,
  VerifyOtpCodeParams,
} from '@src/types/request';

export const recallUserAction = createAsyncThunk<
  IUserWithToken,
  { userId: string }
>('@auth/recallUser', async ({ userId }, { rejectWithValue }) => {
  try {
    const { token, id } = await getStorageUser();

    const data = await authApi.recallUser({ id: userId || id });

    await delay(2000);

    console.log({ data });

    return { ...data, token };
  } catch (error) {
    const axiosError = error as AxiosError;

    return rejectWithValue(axiosError?.response?.data);
  }
});

export const loginAction = createAsyncThunk<IUserWithToken, ILoginActionParams>(
  '@auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login({ username, password });

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));

      await delay(2000);

      console.log({ data });

      return data;
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const requestSignupOtpAction = createAsyncThunk<
  IUserWithToken,
  IRegistrationActionParams
>(
  '@authentication/requestSignupOtp',
  async ({ username, password, email }, { rejectWithValue }) => {
    try {
      const data = await authApi.registration({
        username,
        password,
        email,
      });
      await delay(1500);

      console.log({ data });

      return data;
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const verifySignupOtpCodeAction = createAsyncThunk<
  IUserWithToken,
  VerifyOtpCodeParams
>(
  '@authentication/verifySignupOtpCode',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await userApi.verifyEmail({ email, otp });
      await delay(500);

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
      await AsyncStorage.removeItem(TimerName.RegistrationCode);

      console.log({ data });

      return data;
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const logoutAction = createAsyncThunk(
  '@authentication/logout',
  async () => {
    await authApi.revokeToken();

    await removeStorageUser();
  },
);
