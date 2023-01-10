import AsyncStorage from '@react-native-async-storage/async-storage';

import { IUser } from '@src/types/user';
import { USER_KEY } from '@src/constants/asyncStorage';

export const getStorageUser = async (): Promise<IUser & { token: string }> => {
  const storageUser = await AsyncStorage.getItem(USER_KEY);

  return (storageUser && JSON.parse(storageUser)) || {};
};

export const removeStorageUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_KEY);
};
