import { IUser, IUserWithToken } from '@src/types/user';
import {
  ILoginActionParams,
  IRegistrationActionParams,
} from '@src/types/request';

import { http } from '../HttpService';

const login = ({
  username,
  password,
}: ILoginActionParams): Promise<IUserWithToken> =>
  http.post<ILoginActionParams, IUserWithToken>(
    '/auth/authenticate',
    {
      username,
      password,
    },
    { withCredentials: true },
  );

const recallUser = ({ id }: { id: string }): Promise<IUser> =>
  http.get<string, IUser>(`/api/user/${id}`);

const revokeToken = (): Promise<void> =>
  http.post<undefined, void>('/auth/revoke-token', undefined, {
    withCredentials: true,
  });

const registration = ({
  username,
  password,
  email,
}: IRegistrationActionParams): Promise<IUserWithToken> =>
  http.post<IRegistrationActionParams, IUserWithToken>('/auth/registration', {
    username,
    password,
    email,
  });

export const authApi = {
  login,
  recallUser,
  revokeToken,
  registration,
};
