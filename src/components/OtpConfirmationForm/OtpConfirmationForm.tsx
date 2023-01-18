import React, { FC, useCallback, useState } from 'react';
import { Formik, FormikErrors } from 'formik';
import { Button, Flex, VStack } from 'native-base';

import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import { useForm } from '@src/hooks/useForm';
import { required } from '@src/validators/common';
import { InputOtp } from '@src/components/control/Input/InputOtp';
import { IOtpFormValues } from '@src/types/form';
import { OTP_LENGTH } from '@src/constants/common';

interface IOtpConfirmation {
  submitCallback: (values: IOtpFormValues) => Promise<void>;
  restTime: number;
  isTimerInitializing: boolean;
  resendCode: () => void;
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

const OTP_CONFIRMATION_FORM_INITIAL_VALUES: IOtpFormValues = {
  otp: '',
};

export const OtpConfirmationForm: FC<IOtpConfirmation> = ({
  restTime,
  resendCode,
  submitCallback,
  cancelVerification,
  isTimerInitializing,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isResendLoading, setResendLoading] = useState(false);

  const handleSubmitCallback = useCallback(
    async ({ otp }: IOtpFormValues) => {
      setLoading(true);

      try {
        await submitCallback({ otp });
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [submitCallback],
  );

  const handleResend = useCallback(async () => {
    setResendLoading(true);

    await resendCode();

    setResendLoading(false);
  }, []);

  const { validate, onSubmit } = useForm<IOtpFormValues>({
    submitCallback: handleSubmitCallback,
    fieldsValidators: {
      otp: [required],
    },
    errorMapper: VERIFICATION_ERROR_MAPPER,
  });

  const [isPinReady, setIsPinReady] = useState(false);

  return (
    <Formik<IOtpFormValues>
      initialValues={OTP_CONFIRMATION_FORM_INITIAL_VALUES}
      onSubmit={onSubmit}
      validate={validate}
    >
      {formik => {
        const isFormLoading = isLoading || formik.isSubmitting;

        return (
          <VStack mt={5} space={2}>
            <InputOtp
              setIsPinReady={setIsPinReady}
              label="Код подтверждения"
              error={formik.errors.otp}
              value={formik.values.otp}
              isInvalid={Boolean(formik.touched.otp || formik.submitCount)}
              onChangeText={formik.handleChange('otp')}
              onBlur={formik.handleBlur('otp')}
              isDisabled={isFormLoading || isResendLoading}
              maximumLength={OTP_LENGTH}
            />

            <Flex direction="row">
              <Button
                p={0}
                size="sm"
                variant="ghost"
                isDisabled={isFormLoading}
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
              isDisabled={isFormLoading || !isPinReady}
              isLoading={isFormLoading}
              onPress={formik.handleSubmit}
            >
              Подтвердить
            </Button>
          </VStack>
        );
      }}
    </Formik>
  );
};
