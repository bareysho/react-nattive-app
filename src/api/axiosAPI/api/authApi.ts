import { IUser } from '@src/types/user';

import { http } from '../HttpService';

const login = (username: string, password: string) => {
  return http.post<
    { username: string; password: string },
    IUser & { token: string }
  >(
    '/auth/authenticate',
    {
      username,
      password,
    },
    { withCredentials: true },
  );
};

const recallUser = (id: string) => {
  return http.get<string, IUser>(`/api/user/${id}`);
};

const revokeToken = () => {
  return http.post<unknown, void>(
    '/auth/revoke-token',
    {},
    { withCredentials: true },
  );
};

const registration = ({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}) => {
  return http.post<
    { username: string; password: string; email: string },
    IUser & { token: string }
  >('/auth/registration', { username, password, email });
};

export const authApi = {
  login,
  recallUser,
  revokeToken,
  registration,
};
