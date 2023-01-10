import { IUser } from '@src/types/user';

import { http } from '../HttpService';

export const getUser = async (userId: string) => {
  return http.get<string, { user: IUser }>(`/user/${userId}`);
};

export const userApi = {
  getUser,
};
