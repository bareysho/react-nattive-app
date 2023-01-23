import React, { FC, useCallback, useContext, useEffect } from 'react';
import { Formik, FormikErrors } from 'formik';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAppDispatch } from '@src/redux/store';
import {
  confirmationPasswordValidate,
  onlyLatin,
  required,
  validateEmail,
  validatePassword,
} from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import {
  Box,
  Button,
  Center,
  VStack,
  Text,
  FormError,
  InputControlled,
  InputPassword,
  InputWithIcon,
} from '@src/components/UI';
import { TimerName } from '@src/enums/timer';
import { OtpConfirmationForm } from '@src/components/OtpConfirmationForm';
import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import {
  requestSignupOtpAction,
  verifySignupOtpCodeAction,
} from '@src/redux/actions/authActions';
import { AlreadyRegisteredSection } from '@src/components/AlreadyRegisteredSection';
import { IOtpFormValues } from '@src/types/form';
import { usePageWithOtpForm } from '@src/hooks/usePageWithOtpForm';
import { PageWithOtpState } from '@src/enums/otpCode';
import { PageLayout } from '@src/components/PageLayout';
import { ScreenLoadingContext } from '@src/providers/ScreenLoadingProvider';

interface IRegistrationFormValues {
  username: string;
  email: string;
  password: string;
  confirmationPassword: string;
}

export const REGISTRATION_ERROR_MAPPER: Record<
  string,
  FormikErrors<IRegistrationFormValues>
> = {
  EMAIL_EXISTS: {
    email: 'Email уже зарегистрирован',
  },
  USERNAME_EXISTS: {
    username: 'Имя пользователя уже зарегистрировано',
  },
};

const REGISTRATION_FORM_INITIAL_VALUES: IRegistrationFormValues = {
  username: '',
  email: '',
  password: '',
  confirmationPassword: '',
};

export const Registration: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const onRequestOtp = async ({
    username,
    password,
    email,
  }: IRegistrationFormValues) => {
    await dispatch(
      requestSignupOtpAction({ username, password, email }),
    ).unwrap();
  };

  const {
    pageState,
    restTime,
    resendCode,
    submitRequestCode,
    storedFormValues: userValues,
    cancelVerification,
    isNeedDisableForm,
    isTimerInitializing,
  } = usePageWithOtpForm<IRegistrationFormValues>({
    name: TimerName.RegistrationCode,
    onRequestOtp,
    initValues: REGISTRATION_FORM_INITIAL_VALUES,
  });

  const { setScreenLoading } = useContext(ScreenLoadingContext);

  useEffect(() => {
    setScreenLoading(isTimerInitializing);
  }, [isTimerInitializing]);

  const { validate, onSubmit, submitRequestError } =
    useForm<IRegistrationFormValues>({
      submitCallback: submitRequestCode,
      fieldsValidators: {
        username: [required, onlyLatin],
        email: [required, validateEmail],
        password: [required, validatePassword],
        confirmationPassword: [required, validatePassword],
      },
      formValidator: confirmationPasswordValidate,
      errorMapper: REGISTRATION_ERROR_MAPPER,
    });

  const submitOtpVerification = useCallback(
    async ({ otp }: IOtpFormValues) => {
      await dispatch(
        verifySignupOtpCodeAction({ otp, email: userValues.email }),
      ).unwrap();

      navigation.navigate('Home');
    },
    [dispatch, userValues, navigation],
  );

  return (
    <PageLayout>
      <Box width="100%">
        <Text fontSize={20} fontWeight={600}>
          Регистрация
        </Text>

        <Text fontSize={18} fontWeight={300} mt={1}>
          Зарегистрируйтесь чтобы продолжить!
        </Text>

        <Center width="100%" my={18}>
          <MaterialIcons name={'supervisor-account'} size={98} color="gray" />
        </Center>

        <Formik<IRegistrationFormValues>
          initialValues={REGISTRATION_FORM_INITIAL_VALUES}
          onSubmit={onSubmit}
          validate={validate}
          validateOnChange
          validateOnBlur
        >
          {formik => {
            const isDisabledFields = formik.isSubmitting || isNeedDisableForm;

            return (
              <VStack width="100%" mt={5}>
                <InputWithIcon
                  label="Имя пользователя"
                  isDisabled={isDisabledFields}
                  error={formik.errors.username}
                  value={formik.values.username}
                  isInvalid={Boolean(
                    formik.touched.username || formik.submitCount,
                  )}
                  onChangeText={formik.handleChange('username')}
                  onBlur={formik.handleBlur('username')}
                  placeholder="Введите имя пользователя"
                  InputLeftElement={<MaterialIcons name={'person'} />}
                />

                <InputControlled
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

                <InputPassword
                  label="Пароль"
                  isDisabled={isDisabledFields}
                  error={formik.errors.password}
                  value={formik.values.password}
                  isInvalid={Boolean(
                    formik.touched.password || formik.submitCount,
                  )}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  placeholder="Введите пароль"
                />

                <InputPassword
                  isDisabled={isDisabledFields}
                  error={formik.errors.confirmationPassword}
                  value={formik.values.confirmationPassword}
                  isInvalid={Boolean(
                    formik.touched.confirmationPassword || formik.submitCount,
                  )}
                  onChangeText={formik.handleChange('confirmationPassword')}
                  onBlur={formik.handleBlur('confirmationPassword')}
                  placeholder="Подтвердите пароль"
                />

                {submitRequestError && (
                  <FormError message={submitRequestError} />
                )}

                {pageState === PageWithOtpState.Init && (
                  <>
                    <Button
                      mt={10}
                      width="100%"
                      onPress={formik.handleSubmit}
                      isDisabled={!!restTime || isDisabledFields}
                      isLoading={formik.isSubmitting}
                    >
                      Регистрация
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

        {pageState === PageWithOtpState.CodeSent && (
          <OtpConfirmationForm
            resendCode={resendCode}
            restTime={restTime}
            isTimerInitializing={isTimerInitializing}
            submitCallback={submitOtpVerification}
            cancelVerification={cancelVerification}
          />
        )}

        <AlreadyRegisteredSection navigate={navigation.navigate} />
      </Box>
    </PageLayout>
  );
};
