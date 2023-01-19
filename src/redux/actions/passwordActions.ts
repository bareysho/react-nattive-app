import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { authApi, userApi } from '@src/api/axiosAPI';
import { setAuthLoading, setChangePasswordLoading } from '@src/redux/slices';
import { SetRecoveryPasswordActionParams } from '@src/types/request';

export const setRecoveredPasswordAction = createAsyncThunk<
  void,
  SetRecoveryPasswordActionParams
>(
  '@userSettings/setRecoveredPassword',
  async ({ email, otp, password }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setAuthLoading(true));

      await authApi.setRecoveredPassword({ email, otp, password });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    } finally {
      dispatch(setAuthLoading(false));
    }
  },
);

export const changePassword = createAsyncThunk<
  void,
  { currentPassword: string; password: string }
>(
  '@userSettings/changePassword',
  async ({ currentPassword, password }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setChangePasswordLoading(true));

      await userApi.changePassword({
        currentPassword,
        password,
      });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    } finally {
      dispatch(setChangePasswordLoading(false));
    }
  },
);
