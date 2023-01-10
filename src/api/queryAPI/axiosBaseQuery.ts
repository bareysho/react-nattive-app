import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { BaseQueryFn } from '@reduxjs/toolkit/query';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<{
    url: string;
    method: AxiosRequestConfig['method'];
    body?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  }> =>
  async ({ url, method, body, params }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const error = axiosError as AxiosError;

      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
