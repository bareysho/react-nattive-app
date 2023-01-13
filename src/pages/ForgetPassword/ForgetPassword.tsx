import React, { FC, useCallback, useState } from 'react';
import { Formik, FormikErrors } from 'formik';
import { ParamListBase } from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch } from '@src/redux/store';
import { required, validateEmail } from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import { Input } from '@src/components/control/Input/Input';
import { TimerName } from '@src/enums/timer';
import { OtpConfirmationForm } from '@src/components/OtpConfirmationForm';
import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import { FormError } from '@src/components/control/FormError';
import {
  requestTypedOtpCodeAction,
  verifyTypedOtpCodeAction,
} from '@src/redux/actions/emailActions';
import { OtpCodeType, PageWithOtpState } from '@src/enums/otpCode';
import { UpdatePasswordForm } from '@src/components/UpdatePasswordForm/UpdatePasswordForm';
import { setRecoveredPasswordAction } from '@src/redux/actions/passwordActions';
import {
  IForgotFormValues,
  IOtpFormValues,
  IUpdatePasswordForm,
} from '@src/types/form';
import { AlreadyRegisteredSection } from '@src/components/AlreadyRegisteredSection';
import { usePageWithOtpForm } from '@src/hooks/usePageWithOtpForm';

export const FORGOT_ERROR_MAPPER: Record<
  string,
  FormikErrors<IForgotFormValues>
> = {
  EMAIL_EXISTS: {
    email: 'Email уже зарегистрирован',
  },
};

const FORGOT_FORM_INITIAL_VALUES: IForgotFormValues = {
  email: '',
};

const OTP_FORM_INITIAL_VALUES: IOtpFormValues = {
  otp: '',
};

export const ForgetPassword: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const onRequestOtp = async ({ email }: IForgotFormValues) => {
    await dispatch(
      requestTypedOtpCodeAction({ email, type: OtpCodeType.PasswordRecovery }),
    ).unwrap();
  };

  const {
    pageState,
    restTime,
    resendCode,
    submitRequestCode,
    storedFormValues: forgotFormValues,
    setPageState,
    cancelVerification,
    isNeedDisableForm,
    isTimerInitializing,
  } = usePageWithOtpForm<IForgotFormValues>({
    name: TimerName.RegistrationCode,
    onRequestOtp,
    initValues: FORGOT_FORM_INITIAL_VALUES,
  });

  const [otpFormValues, setOtpFormValues] = useState<IOtpFormValues>(
    OTP_FORM_INITIAL_VALUES,
  );

  const { validate, onSubmit, submitRequestError } = useForm<IForgotFormValues>(
    {
      submitCallback: submitRequestCode,
      fieldsValidators: {
        email: [required, validateEmail],
      },
      errorMapper: FORGOT_ERROR_MAPPER,
    },
  );

  const submitUpdatePassword = useCallback(
    async ({ password }: IUpdatePasswordForm) => {
      await dispatch(
        setRecoveredPasswordAction({
          email: forgotFormValues.email,
          otp: otpFormValues.otp,
          password,
        }),
      ).unwrap();

      setPageState(PageWithOtpState.SuccessUpdate);
    },
    [dispatch, otpFormValues, forgotFormValues?.email],
  );

  const submitOtpVerification = useCallback(
    async ({ otp }: IOtpFormValues) => {
      await dispatch(
        verifyTypedOtpCodeAction({
          otp,
          email: forgotFormValues?.email,
          type: OtpCodeType.PasswordRecovery,
        }),
      ).unwrap();

      setOtpFormValues({ otp });
      setPageState(PageWithOtpState.SetPassword);
    },
    [dispatch],
  );

  return (
    <ScrollView h="80">
      <Center w="100%">
        <Box safeArea p={2} py={10} w="95%">
          <Heading size="lg" fontWeight={600}>
            Восстановить пароль
          </Heading>

          <Heading mt={1} mb={35} fontWeight="medium" size="xs">
            Введите email чтобы продолжить!
          </Heading>

          <Formik<IForgotFormValues>
            initialValues={FORGOT_FORM_INITIAL_VALUES}
            onSubmit={onSubmit}
            validate={validate}
            validateOnChange
            validateOnBlur
          >
            {formik => {
              const isDisabledFields = formik.isSubmitting || isNeedDisableForm;

              return (
                <VStack mt={5} space={4}>
                  <Input
                    label="Email"
                    isDisabled={isDisabledFields}
                    error={formik.errors.email}
                    value={formik.values.email}
                    isInvalid={Boolean(
                      formik.touched.email || formik.submitCount,
                    )}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    placeholder="Введите email"
                  />

                  {submitRequestError && (
                    <FormError message={submitRequestError} />
                  )}

                  {pageState === PageWithOtpState.Init && (
                    <>
                      <Button
                        mt={10}
                        onPress={formik.handleSubmit}
                        isDisabled={!!restTime || isDisabledFields}
                        isLoading={formik.isSubmitting}
                      >
                        Отправить код
                      </Button>

                      {!!restTime && (
                        <Box mt={4}>
                          <OtpTimerInfo timeLeft={restTime} />
                        </Box>
                      )}
                    </>
                  )}
                </VStack>
              );
            }}
          </Formik>

          {pageState === PageWithOtpState.CodeSent && forgotFormValues && (
            <OtpConfirmationForm
              resendCode={resendCode}
              restTime={restTime}
              isTimerInitializing={isTimerInitializing}
              cancelVerification={cancelVerification}
              submitCallback={submitOtpVerification}
            />
          )}

          {pageState === PageWithOtpState.SetPassword && (
            <UpdatePasswordForm submitCallback={submitUpdatePassword} />
          )}

          {pageState === PageWithOtpState.SuccessUpdate && (
            <Text>Обновлен</Text>
          )}

          <AlreadyRegisteredSection navigate={navigation.navigate} />
        </Box>
      </Center>
    </ScrollView>
  );
};
