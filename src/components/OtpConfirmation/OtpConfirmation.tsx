import React, { FC, useCallback, useState } from 'react';
import { Formik, FormikErrors } from 'formik';
import { Button, Flex, VStack } from 'native-base';

import { Input } from '@src/components/control';
import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import { useForm } from '@src/hooks/useForm';
import { required } from '@src/validators/common';
import { verifyRegistration } from '@src/redux/slices/auth/asyncThunks/authAthunkThunks';
import { useAppDispatch } from '@src/redux/store';

interface IOtpFormValues {
  otp: string;
}

interface IOtpConfirmation {
  email: string;
  restTime: number;
  isTimerInitializing: boolean;
  resend: () => void;
  onSuccessVerify: () => void;
  cancelVerification: () => void;
}

export const VERIFICATION_ERROR_MAPPER: Record<
  string,
  FormikErrors<IOtpFormValues>
> = {
  INVALID_OTP: {
    otp: 'Неверный код подтверждения',
  },
  EXPIRED_OTP: {
    otp: 'Устаревший код подтверждения',
  },
};

export const OtpConfirmation: FC<IOtpConfirmation> = ({
  email,
  resend,
  onSuccessVerify,
  cancelVerification,
  restTime,
  isTimerInitializing,
}) => {
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [isResendLoading, setResendLoading] = useState(false);

  const handleSubmitCallback = useCallback(
    async ({ otp }: IOtpFormValues) => {
      setLoading(true);

      await dispatch(verifyRegistration({ otp, email })).unwrap();
      await onSuccessVerify();

      setLoading(false);
    },
    [email],
  );

  const handleResend = useCallback(async () => {
    setResendLoading(true);

    await resend();

    setResendLoading(false);
  }, []);

  const { validate, onSubmit } = useForm<IOtpFormValues>({
    submitCallback: handleSubmitCallback,
    fieldsValidators: {
      otp: [required],
    },
    errorMapper: VERIFICATION_ERROR_MAPPER,
  });

  return (
    <Formik<IOtpFormValues>
      initialValues={{
        otp: '',
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      {formik => (
        <VStack mt={5} space={2}>
          <Input
            label="Код подтверждения"
            error={formik.errors.otp}
            value={formik.values.otp}
            isInvalid={Boolean(formik.touched.otp || formik.submitCount)}
            onChangeText={formik.handleChange('otp')}
            onBlur={formik.handleBlur('otp')}
            isDisabled={isLoading || formik.isSubmitting || isResendLoading}
            placeholder="Введите код подтверждения"
          />

          <Flex direction="row">
            <Button
              p={0}
              size="sm"
              variant="ghost"
              isDisabled={isLoading || formik.isSubmitting}
              onPress={cancelVerification}
            >
              Изменить email
            </Button>
          </Flex>

          {!isTimerInitializing && (
            <>
              {restTime ? (
                <OtpTimerInfo timeLeft={restTime} />
              ) : (
                <Flex direction="row">
                  <Button
                    isDisabled={isResendLoading}
                    isLoading={isResendLoading}
                    p={0}
                    size="sm"
                    variant="ghost"
                    onPress={handleResend}
                  >
                    Повторить отправку
                  </Button>
                </Flex>
              )}
            </>
          )}

          <Button
            mt={5}
            isDisabled={isLoading || formik.isSubmitting}
            isLoading={isLoading || formik.isSubmitting}
            onPress={formik.handleSubmit}
          >
            Подтвердить
          </Button>
        </VStack>
      )}
    </Formik>
  );
};
