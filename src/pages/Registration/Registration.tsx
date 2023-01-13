import React, { FC, useCallback, useMemo, useState } from 'react';
import { Formik, FormikErrors } from 'formik';
import { ParamListBase } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Link,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch } from '@src/redux/store';
import {
  confirmationPasswordValidate,
  onlyLatin,
  required,
  validateEmail,
  validatePassword,
} from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import { Input } from '@src/components/control/Input/Input';
import { InputPassword, InputWithIcon } from '@src/components/control';
import { useCountdown } from '@src/hooks/useCountdown';
import { OTP_TIMER_LIMIT } from '@src/constants/common';
import { TimerName } from '@src/enums/timer';
import { OtpConfirmation } from '@src/components/OtpConfirmation';
import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import { registration } from '@src/redux/slices/auth/asyncThunks/authAthunkThunks';
import { FormError } from '@src/components/control/FormError';

interface IRegistrationFormValues {
  login: string;
  email: string;
  password: string;
  confirmationPassword: string;
}

enum PageState {
  Init,
  CodeSent,
}

export const REGISTRATION_ERROR_MAPPER: Record<
  string,
  FormikErrors<IRegistrationFormValues>
> = {
  EMAIL_EXISTS: {
    email: 'Email уже зарегистрирован',
  },
  USERNAME_EXISTS: {
    login: 'Имя пользователя уже зарегистрировано',
  },
};

export const Registration: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const [pageState, setPageState] = useState(PageState.Init);

  const {
    start: timerStart,
    time: restTime,
    isInitializing: isTimerInitializing,
  } = useCountdown(OTP_TIMER_LIMIT, TimerName.RegistrationCode);

  const [userValues, setUserValues] = useState<IRegistrationFormValues>();

  const requestOtp = async ({
    login: username,
    password,
    email,
  }: IRegistrationFormValues) => {
    await dispatch(registration({ username, password, email })).unwrap();
    await timerStart();

    setPageState(PageState.CodeSent);
  };

  const submitCallback = async (values: IRegistrationFormValues) => {
    setUserValues(values);

    await requestOtp(values);
  };

  const { validate, onSubmit, submitRequestError } =
    useForm<IRegistrationFormValues>({
      submitCallback: submitCallback,
      fieldsValidators: {
        login: [required, onlyLatin],
        email: [required, validateEmail],
        password: [required, validatePassword],
        confirmationPassword: [required, validatePassword],
      },
      formValidator: confirmationPasswordValidate,
      errorMapper: REGISTRATION_ERROR_MAPPER,
    });

  const resendCode = useCallback(
    () => userValues && requestOtp(userValues),
    [userValues],
  );

  const cancelVerification = useCallback(() => {
    setPageState(PageState.Init);
  }, []);

  const getNavigateCallback = useCallback(
    (route: string) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const isNeedDisableForm = useMemo(
    () => Boolean(isTimerInitializing || pageState === PageState.CodeSent),
    [isTimerInitializing, pageState],
  );

  return (
    <ScrollView h="80">
      <Center w="100%">
        <Box safeArea p={2} py={10} w="95%">
          <Heading size="lg" fontWeight={600}>
            Регистрация
          </Heading>

          <Heading mt={1} mb={35} fontWeight="medium" size="xs">
            Зарегистрируйтесь чтобы продолжить!
          </Heading>

          <Formik<IRegistrationFormValues>
            initialValues={{
              login: '',
              email: '',
              password: '',
              confirmationPassword: '',
            }}
            onSubmit={onSubmit}
            validate={validate}
            validateOnChange
            validateOnBlur
          >
            {formik => {
              const isDisabledFields = formik.isSubmitting || isNeedDisableForm;

              return (
                <VStack mt={5} space={4}>
                  <InputWithIcon
                    label="Имя пользователя"
                    isDisabled={isDisabledFields}
                    error={formik.errors.login}
                    value={formik.values.login}
                    isInvalid={Boolean(
                      formik.touched.login || formik.submitCount,
                    )}
                    onChangeText={formik.handleChange('login')}
                    onBlur={formik.handleBlur('login')}
                    placeholder="Введите имя пользователя"
                    icon={<MaterialIcons name={'person'} />}
                  />

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

                  {pageState === PageState.Init && (
                    <>
                      <Button
                        mt={10}
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

          {pageState === PageState.CodeSent && userValues && (
            <OtpConfirmation
              resend={resendCode}
              restTime={restTime}
              email={userValues.email}
              isTimerInitializing={isTimerInitializing}
              cancelVerification={cancelVerification}
              onSuccessVerify={getNavigateCallback('Home')}
            />
          )}

          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm">У меня есть аккаунт. </Text>

            <Link onPress={getNavigateCallback('Login')}>Войти</Link>
          </HStack>
        </Box>
      </Center>
    </ScrollView>
  );
};
