import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { OtpCodeType } from '@src/enums/otpCode';
import { emailApi } from '@src/api/axiosAPI';
import { setChangeEmailLoading, setAuthLoading } from '@src/redux/slices';
import {
  RequestOtpWithTypeParams,
  VerifyOtpCodeWithTypeParams,
} from '@src/types/request';

const setLoadingMapper = {
  [OtpCodeType.Verification]: setAuthLoading,
  [OtpCodeType.ChangeEmail]: setChangeEmailLoading,
  [OtpCodeType.PasswordRecovery]: setAuthLoading,
};

export const requestTypedOtpCodeAction = createAsyncThunk<
  void,
  RequestOtpWithTypeParams
>(
  '@auth/requestTypedOtpCode',
  async ({ email, type }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingMapper[type](true));

      await emailApi.requestEmailCode({ email, type });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    } finally {
      dispatch(setLoadingMapper[type](false));
    }
  },
);

export const verifyTypedOtpCodeAction = createAsyncThunk<
  void,
  VerifyOtpCodeWithTypeParams
>(
  '@auth/verifyTypedOtpCode',
  async ({ email, otp, type }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoadingMapper[type](true));

      await emailApi.verifyEmailCode({ email, otp, type });
    } catch (error) {
      const axiosError = error as AxiosError;

      return rejectWithValue(axiosError?.response?.data);
    } finally {
      dispatch(setLoadingMapper[type](false));
    }
  },
);
