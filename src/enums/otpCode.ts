export enum OtpCodeType {
  Verification = 'VERIFICATION',
  PasswordRecovery = 'PASSWORD_RECOVERY',
  ChangeEmail = 'CHANGE_EMAIL',
}

export enum PageWithOtpState {
  Init,
  CodeSent,
  SetPassword,
  SuccessUpdate,
}
