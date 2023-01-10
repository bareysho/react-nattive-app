import { createApi } from '@reduxjs/toolkit/query';

import { QueryTagName } from '@src/enums/queryTagName';

import { axiosBaseQuery } from './axiosBaseQuery';

export const baseQueryApi = createApi({
  reducerPath: 'queryApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'localhost/',
  }),
  tagTypes: Object.values(QueryTagName),
  endpoints: () => ({}),
});
