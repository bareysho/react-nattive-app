export interface IUpdatePasswordForm {
  password: string;
  confirmationPassword: string;
}

export interface IForgotFormValues {
  email: string;
}

export interface IChangeEmailFormValues {
  email: string;
}

export interface IOtpFormValues {
  otp: string;
}

export interface ILoginFormValues {
  login: string;
  password: string;
}
