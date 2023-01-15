import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { CustomAny } from '@src/types/common/customAny';
import { getStorageUser } from '@src/utils/asyncStorage';

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
            const { token } = await getStorageUser();

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/dot-notation
            config.headers['authorization'] = `bearer ${token}`;
          }
        }

        return config;
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
