import { IUser } from '@src/types/user';
import {
  IChangePasswordActionParams,
  IRequestOtpCode,
  VerifyOtpCodeParams,
} from '@src/types/request';

import { http } from '../HttpService';

export const getUser = ({
  userId,
}: {
  userId: string;
}): Promise<{ user: IUser }> =>
  http.get<string, { user: IUser }>(`/user/${userId}`);

const changePassword = ({
  currentPassword,
  password,
}: IChangePasswordActionParams) =>
  http.patch<IChangePasswordActionParams, void>('/api/user/change-password', {
    currentPassword,
    password,
  });

const requestChangeEmailCode = ({ email }: IRequestOtpCode): Promise<void> =>
  http.post<IRequestOtpCode, void>(
    '/api/user/request-change-email-code',
    { email },
    { withCredentials: true },
  );

const verifyChangeEmail = ({
  email,
  otp,
}: VerifyOtpCodeParams): Promise<void> =>
  http.patch<VerifyOtpCodeParams, void>(
    '/api/user/change-email',
    { email, otp },
    { withCredentials: true },
  );

export const userApi = {
  getUser,
  changePassword,
  changeEmail: verifyChangeEmail,
  requestChangeEmailCode,
};
