import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { userApi } from '@src/api/axiosAPI';
import { IRequestOtpCode, VerifyOtpCodeParams } from '@src/types/request';
import { setChangeEmailLoading } from '@src/redux/slices';
import { updateAuthUser } from '@src/redux/slices/authenticationSlice';

export const requestChangeEmailAction = createAsyncThunk<void, IRequestOtpCode>(
  '@auth/requestTypedOtpCode',
  async ({ email }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setChangeEmailLoading(true));

      await userApi.requestChangeEmailCode({ email });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    } finally {
      dispatch(setChangeEmailLoading(false));
    }
  },
);

export const changeEmailAction = createAsyncThunk<void, VerifyOtpCodeParams>(
  '@userSettings/changeEmail',
  async ({ email, otp }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setChangeEmailLoading(true));

      await userApi.changeEmail({ email, otp });

      await dispatch(updateAuthUser({ email }));
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    } finally {
      dispatch(setChangeEmailLoading(false));
    }
  },
);
