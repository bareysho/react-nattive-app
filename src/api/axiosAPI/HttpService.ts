import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CustomAny } from '@src/types/common/customAny';
import { store } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { authApi } from '@src/api/axiosAPI/api/authApi';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_ID_KEY,
} from '@src/constants/asyncStorage';
import { setAuthInitialState } from '@src/redux/slices/authenticationSlice';

class HttpService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = HttpService.initHttp();
  }

  private static initHttp(): AxiosInstance {
    const axiosInstance = axios.create({
      timeout: 30 * 1000,
      baseURL: 'https://workout-plan-node-server.herokuapp.com',
      // baseURL: 'http://192.168.1.2:3000',
    });

    axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        if (config.headers) {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/dot-notation
          if (!config.headers['authorization']) {
            const { token } = selectAuthState(store.getState());

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/dot-notation
            config.headers['authorization'] = `bearer ${token}`;
          }
        }

        return config;
      },
    );

    axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        // Logout if refresh token expired
        if (
          error.response.status === 400 &&
          error.response.data.error.message === 'INVALID_REFRESH_TOKEN_ERROR'
        ) {
          await AsyncStorage.removeItem(USER_ID_KEY);
          await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
          await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

          store.dispatch(setAuthInitialState());
        }

        if (
          error.response.status === 401 &&
          error.response.data.message === 'TOKEN_EXPIRED'
        ) {
          try {
            const currentRefreshToken = await AsyncStorage.getItem(
              REFRESH_TOKEN_KEY,
            );

            if (currentRefreshToken) {
              const { refreshToken, token, id } = await authApi.refreshToken({
                refreshToken: currentRefreshToken,
              });

              await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
              await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
              await AsyncStorage.setItem(USER_ID_KEY, id);

              const config = error.config;

              config.headers.authorization = `bearer ${token}`;

              return await new Promise((resolve, reject) => {
                axios
                  .request(config)
                  .then(response => resolve(response))
                  .catch(reconfiguredRequestError =>
                    reject(reconfiguredRequestError),
                  );
              });
            } else {
              await AsyncStorage.removeItem(USER_ID_KEY);
              await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
              await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

              store.dispatch(setAuthInitialState());
            }
          } catch (refreshTokenError) {
            return Promise.reject(refreshTokenError);
          }
        }

        return Promise.reject(error);
      },
    );

    return axiosInstance;
  }

  async get<T = CustomAny, R = AxiosResponse<T>>(
    url: string,
    params?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.http.get(url, params);

    return response.data;
  }

  async put<T = CustomAny, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    params?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.http.put(url, data, params);

    return response.data;
  }

  async post<T = CustomAny, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    params?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.http.post(url, data, params);

    return response.data;
  }

  async patch<T = CustomAny, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    params?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.http.patch(url, data, params);

    return response.data;
  }

  async delete<T = CustomAny, R = AxiosResponse<T>>(
    url: string,
    params?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.http.delete(url, params);

    return response.data;
  }
}

export const http = new HttpService();
