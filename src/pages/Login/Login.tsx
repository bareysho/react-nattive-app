import React, { FC, useCallback } from 'react';
import { Formik, FormikValues } from 'formik';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  Button,
  Center,
  HStack,
  Text,
  VStack,
  FormError,
  InputPassword,
  InputWithIcon,
  Icon,
} from '@src/components/UI';
import { selectAuthState } from '@src/selectors/auth';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { loginAction } from '@src/redux/actions/authActions';
import { onlyLatin, required } from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import { ILoginFormValues } from '@src/types/form';
import { PageLayout } from '@src/components/PageLayout';

export const LOGIN_ERRORS_MAPPER: Record<string, Partial<ILoginFormValues>> = {
  INVALID_CREDENTIALS: {
    password: 'Неверное имя пользователя или пароль',
  },
};

export const Login: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector(selectAuthState);

  const submitRegistration = useCallback(
    async ({ login: username, password }: FormikValues): Promise<void> => {
      await dispatch(loginAction({ username, password })).unwrap();

      navigation.navigate('Home');
    },
    [navigation],
  );

  const { validate, onSubmit, submitRequestError } = useForm<ILoginFormValues>({
    submitCallback: submitRegistration,
    fieldsValidators: {
      login: [required, onlyLatin],
      password: [required],
    },
    errorMapper: LOGIN_ERRORS_MAPPER,
  });

  const getNavigateCallback = useCallback(
    (route: string) => () => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <PageLayout withScroll>
      <Text fontSize={20} fontWeight={600}>
        Добро пожаловать
      </Text>

      <Text fontSize={18} fontWeight={300} mt={1}>
        Авторизируйтесь чтобы продолжить!
      </Text>

      <Center width="100%" my={36}>
        <Icon size={98} as={<MaterialIcons name="fitness-center" />} />
      </Center>

      <Formik<ILoginFormValues>
        initialValues={{ login: '', password: '' }}
        onSubmit={onSubmit}
        validateOnChange
        validateOnBlur
        validate={validate}
      >
        {formik => (
          <VStack width="100%">
            <InputWithIcon
              label="Имя пользователя"
              isDisabled={isLoading}
              error={formik.errors.login}
              value={formik.values.login}
              isInvalid={Boolean(formik.touched.login || formik.submitCount)}
              onChangeText={formik.handleChange('login')}
              onBlur={formik.handleBlur('login')}
              placeholder="Введите имя пользователя"
              InputLeftElement={<MaterialIcons name="person" />}
            />

            <InputPassword
              label="Пароль"
              isDisabled={isLoading}
              error={formik.errors.password}
              value={formik.values.password}
              isInvalid={Boolean(formik.touched.password || formik.submitCount)}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              placeholder="Введите пароль"
            />

            {submitRequestError && <FormError message={submitRequestError} />}

            <Button
              alignSelf="flex-end"
              variant="ghost"
              onPress={getNavigateCallback('ForgetPassword')}
            >
              Забыли пароль?
            </Button>

            <Button
              mt={6}
              width="100%"
              onPress={formik.handleSubmit}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Войти
            </Button>

            <HStack
              width="100%"
              mt={6}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={14}>Я новый пользователь. </Text>

              <Button
                variant="ghost"
                onPress={getNavigateCallback('Registration')}
              >
                Зарегистрироваться
              </Button>
            </HStack>
          </VStack>
        )}
      </Formik>
    </PageLayout>
  );
};
