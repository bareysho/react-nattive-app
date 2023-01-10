import { AxiosError } from 'axios';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IUser } from '@src/types/user';
import { authApi } from '@src/api/axiosAPI';
import { USER_KEY } from '@src/constants/asyncStorage';
import { getStorageUser, removeStorageUser } from '@src/utils/asyncStorage';

export const setAuthLoading = createAction<boolean>('@auth/setAuthLoading');

type UserWithToken = IUser & { token: string };

const sleep = (ms: number) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve('');
    }, ms),
  );

export const recallUser = createAsyncThunk<UserWithToken, string | undefined>(
  '@auth/recallUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { token, id } = await getStorageUser();

      const data = await authApi.recallUser(userId || id);

      await sleep(2000);

      return { ...data, token };
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    }
  },
);

export const login = createAsyncThunk<
  UserWithToken,
  { username: string; password: string }
>('@auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const data = await authApi.login(username, password);

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));

    await sleep(2000);

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    return rejectWithValue(axiosError?.response?.data);
  }
});

export const logout = createAsyncThunk('@auth/logout', async () => {
  await authApi.revokeToken();

  await removeStorageUser();
});
