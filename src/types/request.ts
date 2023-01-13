import { OtpCodeType } from '@src/enums/otpCode';

interface IWithOtpCode {
  otp: string;
}

interface IWithOtpType {
  type: OtpCodeType;
}

export interface IChangePasswordActionParams {
  password: string;
  currentPassword: string;
}

export interface IRegistrationActionParams {
  username: string;
  password: string;
  email: string;
}

export interface IRequestRecoveryOtpActionParams {
  email: string;
}

export interface ILoginActionParams {
  username: string;
  password: string;
}

export interface IRequestOtpCode {
  email: string;
}

export type RequestOtpWithTypeParams = IRequestOtpCode & IWithOtpType;

export type VerifyOtpCodeParams = IRequestOtpCode & IWithOtpCode;

export type VerifyOtpCodeWithTypeParams = IRequestOtpCode &
  IWithOtpCode &
  IWithOtpType;

export type SetRecoveryPasswordActionParams = IRequestRecoveryOtpActionParams &
  IWithOtpCode & {
    password: string;
  };
