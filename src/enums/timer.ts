export enum TimerState {
  Initial = 'initial',
  Started = 'started',
  Ended = 'ended',
}

export enum TimerType {
  Decremental = 'DECREMENTAL',
  Incremental = 'INCREMENTAL',
}

export enum TimerName {
  RecoveryCode = '@recoveryCode',
  RegistrationCode = '@registrationCode',
  ChangeEmailCode = '@changeEmailCode',
}
