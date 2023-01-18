import { IUser } from '@src/types/user';
import {
  IChangePasswordActionParams,
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

const changeEmail = ({ email, otp }: VerifyOtpCodeParams): Promise<void> =>
  http.patch<VerifyOtpCodeParams, void>(
    '/api/user/change-email',
    { email, otp },
    { withCredentials: true },
  );

export const userApi = {
  getUser,
  changePassword,
  changeEmail,
};
