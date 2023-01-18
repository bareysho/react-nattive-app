import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { authApi } from '@src/api/axiosAPI';
import { setAuthLoading } from '@src/redux/slices';
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
