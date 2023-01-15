import { useCallback, useMemo, useState } from 'react';

import { OTP_TIMER_LIMIT } from '@src/constants/common';
import { useCountdown } from '@src/hooks/useCountdown';
import { TimerName } from '@src/enums/timer';
import { PageWithOtpState } from '@src/enums/otpCode';

interface IUseOtpPageValues<T> {
  restTime: number;
  isTimerInitializing: boolean;
  isNeedDisableForm: boolean;
  storedFormValues: T;
  cancelVerification: () => void;
  pageState: PageWithOtpState;
  setPageState: (state: PageWithOtpState) => void;
  submitRequestCode: (values: T) => Promise<void>;
  resendCode: () => Promise<void>;
}

interface IUseOtpParams<T> {
  name: TimerName;
  initValues: T;
  onRequestOtp: (values: T) => Promise<void>;
}

export const usePageWithOtpForm = <T>({
  name,
  initValues,
  onRequestOtp,
}: IUseOtpParams<T>): IUseOtpPageValues<T> => {
  const [pageState, setPageState] = useState(PageWithOtpState.Init);

  const [storedFormValues, setStoredFormValues] = useState<T>(initValues);

  const {
    start: timerStart,
    time: restTime,
    isInitializing: isTimerInitializing,
  } = useCountdown(OTP_TIMER_LIMIT, name);

  const cancelVerification = useCallback(() => {
    setPageState(PageWithOtpState.Init);
  }, []);

  const isNeedDisableForm = useMemo(
    () => Boolean(isTimerInitializing || pageState !== PageWithOtpState.Init),
    [isTimerInitializing, pageState],
  );

  const requestOtp = async (values: T) => {
    await onRequestOtp(values);
    await timerStart();

    setPageState(PageWithOtpState.CodeSent);
  };

  const submitRequestCode = async (values: T) => {
    setStoredFormValues(values);

    await requestOtp(values);
  };

  const resendCode = useCallback(
    () => requestOtp(storedFormValues),
    [storedFormValues],
  );

  return {
    restTime,
    isNeedDisableForm,
    isTimerInitializing,
    cancelVerification,
    storedFormValues,
    resendCode,
    pageState,
    setPageState,
    submitRequestCode,
  };
};
