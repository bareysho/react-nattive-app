import { IUser, IUserWithToken } from '@src/types/user';
import {
  IChangePasswordActionParams,
  SetRecoveryPasswordActionParams,
  VerifyOtpCodeParams,
} from '@src/types/request';

import { http } from '../HttpService';

export const getUser = ({
  userId,
}: {
  userId: string;
}): Promise<{ user: IUser }> =>
  http.get<string, { user: IUser }>(`/user/${userId}`);

const verifyEmail = ({
  email,
  otp,
}: VerifyOtpCodeParams): Promise<IUserWithToken> =>
  http.patch<VerifyOtpCodeParams, IUserWithToken>(
    '/api/user/verify-email',
    { email, otp },
    { withCredentials: true },
  );

const changePassword = ({
  currentPassword,
  password,
}: IChangePasswordActionParams) =>
  http.patch<IChangePasswordActionParams, void>('/api/user/change-password', {
    currentPassword,
    password,
  });

const setRecoveredPassword = ({
  email,
  otp,
  password,
}: SetRecoveryPasswordActionParams): Promise<void> =>
  http.patch<SetRecoveryPasswordActionParams, void>(
    '/api/user/recovery-password',
    { email, otp, password },
  );

const changeEmail = ({ email, otp }: VerifyOtpCodeParams): Promise<void> =>
  http.patch<VerifyOtpCodeParams, void>(
    '/api/user/change-email',
    { email, otp },
    { withCredentials: true },
  );

export const userApi = {
  getUser,
  verifyEmail,
  changePassword,
  setRecoveredPassword,
  changeEmail,
};
