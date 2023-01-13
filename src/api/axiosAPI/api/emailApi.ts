import {
  RequestOtpWithTypeParams,
  VerifyOtpCodeWithTypeParams,
} from '@src/types/request';

import { http } from '../HttpService';

const BASE_URL = '/email-code';

const requestEmailCode = ({
  email,
  type,
}: RequestOtpWithTypeParams): Promise<void> =>
  http.post<RequestOtpWithTypeParams, void>(`${BASE_URL}/request-email-code`, {
    email,
    type,
  });

const verifyEmailCode = ({
  email,
  otp,
  type,
}: VerifyOtpCodeWithTypeParams): Promise<void> =>
  http.post<VerifyOtpCodeWithTypeParams, void>(
    `${BASE_URL}/verify-email-code`,
    { email, otp, type },
  );

export const emailApi = {
  requestEmailCode,
  verifyEmailCode,
};
