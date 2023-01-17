import { IAuthResponse, IUser } from '@src/types/user';
import {
  ILoginActionParams,
  IRegistrationActionParams,
  VerifyOtpCodeParams,
} from '@src/types/request';

import { http } from '../HttpService';

const login = ({
  username,
  password,
}: ILoginActionParams): Promise<IAuthResponse> =>
  http.post<ILoginActionParams, IAuthResponse>(
    '/auth/authenticate',
    {
      username,
      password,
    },
    { withCredentials: true },
  );

const recallUser = ({ id }: { id: string }): Promise<IUser> =>
  http.get<{ id: string }, IUser>(`/api/user/${id}`);

const revokeToken = ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<void> =>
  http.post<{ refreshToken: string }, void>(
    '/auth/revoke-token',
    { refreshToken },
    {
      withCredentials: true,
    },
  );

const registration = ({
  username,
  password,
  email,
}: IRegistrationActionParams): Promise<void> =>
  http.post<IRegistrationActionParams, void>('/auth/registration', {
    username,
    password,
    email,
  });

const verifyRegistration = ({
  email,
  otp,
}: VerifyOtpCodeParams): Promise<IAuthResponse> =>
  http.patch<VerifyOtpCodeParams, IAuthResponse>(
    '/auth/verify-registration',
    { email, otp },
    { withCredentials: true },
  );

export const authApi = {
  login,
  recallUser,
  revokeToken,
  registration,
  verifyRegistration,
};
