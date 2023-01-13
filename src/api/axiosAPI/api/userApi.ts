import { IUser } from '@src/types/user';

import { http } from '../HttpService';

export const getUser = async (userId: string) => {
  return http.get<string, { user: IUser }>(`/user/${userId}`);
};

interface IVerifyEmailReqestParams {
  email: string;
  otp: string;
}

const verifyEmail = ({ email, otp }: IVerifyEmailReqestParams) => {
  return http.patch<IVerifyEmailReqestParams, IUser & { token: string }>(
    '/api/user/verify-email',
    { email, otp },
    { withCredentials: true },
  );
};

export const userApi = {
  getUser,
  verifyEmail,
};
