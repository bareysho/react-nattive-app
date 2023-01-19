import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Formik, FormikErrors } from 'formik';
import { ParamListBase } from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAppDispatch } from '@src/redux/store';
import { required, validateEmail } from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import { TimerName } from '@src/enums/timer';
import { OtpConfirmationForm } from '@src/components/OtpConfirmationForm';
import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import {
  requestTypedOtpCodeAction,
  verifyTypedOtpCodeAction,
} from '@src/redux/actions/emailTokenActions';
import { OtpCodeType, PageWithOtpState } from '@src/enums/otpCode';
import { UpdatePasswordForm } from '@src/components/UpdatePasswordForm/UpdatePasswordForm';
import { setRecoveredPasswordAction } from '@src/redux/actions/passwordActions';
import {
  IForgotFormValues,
  IOtpFormValues,
  IUpdatePasswordForm,
} from '@src/types/form';
import { usePageWithOtpForm } from '@src/hooks/usePageWithOtpForm';
import { Input } from '@src/components/control';
import { FormError } from '@src/components/control/FormError';
import { AlreadyRegisteredSection } from '@src/components/AlreadyRegisteredSection';
import { PageLayout } from '@src/components/PageLayout';
import { ScreenLoadingContext } from '@src/providers/ScreenLoadingProvider';

export const FORGOT_ERROR_MAPPER: Record<
  string,
  FormikErrors<IForgotFormValues>
> = {
  USER_NOT_FOUND: {
    email: 'Email не зарегистрирован',
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
    name: TimerName.RecoveryCode,
    onRequestOtp,
    initValues: FORGOT_FORM_INITIAL_VALUES,
  });

  const { setScreenLoading } = useContext(ScreenLoadingContext);

  useEffect(() => {
    setScreenLoading(isTimerInitializing);
  }, [isTimerInitializing]);

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
    [dispatch, otpFormValues, forgotFormValues.email],
  );

  const submitOtpVerification = useCallback(
    async ({ otp }: IOtpFormValues) => {
      await dispatch(
        verifyTypedOtpCodeAction({
          otp,
          email: forgotFormValues.email,
          type: OtpCodeType.PasswordRecovery,
        }),
      ).unwrap();

      setOtpFormValues({ otp });
      setPageState(PageWithOtpState.SetPassword);
    },
    [dispatch, forgotFormValues],
  );

  return (
    <PageLayout>
      <Heading size="lg" fontWeight={600}>
        Восстановление пароля
      </Heading>

      <Heading mt={1} fontWeight="medium" size="xs">
        Следуйте инструкциям
      </Heading>

      <Center my={36}>
        <MaterialIcons name={'vpn-key'} size={98} color="gray" />
      </Center>

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
            <VStack w="100%" mt={5} space={3}>
              {pageState !== PageWithOtpState.SuccessUpdate && (
                <>
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
                </>
              )}

              {pageState === PageWithOtpState.Init && (
                <>
                  <Button
                    mt={8}
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
        <Center my={30}>
          <Icon
            size={160}
            as={<MaterialIcons name={'check-circle-outline'} />}
          />

          <HStack alignItems="center" mt={16}>
            <Text fontSize="lg">Пароль успешно обновлен. </Text>

            <Link
              _text={{ fontSize: 'lg' }}
              onPress={() => navigation.navigate('Login')}
            >
              Войти
            </Link>
          </HStack>
        </Center>
      )}

      {pageState !== PageWithOtpState.SuccessUpdate && (
        <AlreadyRegisteredSection navigate={navigation.navigate} />
      )}
    </PageLayout>
  );
};
