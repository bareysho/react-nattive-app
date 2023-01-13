import React, { FC, useCallback } from 'react';
import { Formik, FormikValues } from 'formik';
import { ParamListBase } from '@react-navigation/native';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { selectAuthState } from '@src/selectors/auth';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { loginAction } from '@src/redux/actions/authActions';
import { onlyLatin, required } from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import { InputPassword, InputWithIcon } from '@src/components/control';
import { FormError } from '@src/components/control/FormError';
import { ILoginFormValues } from '@src/types/form';

export const LOGIN_ERRORS_MAPPER: Record<string, Partial<ILoginFormValues>> = {
  INVALID_CREDENTIALS_ERROR: {
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
    <ScrollView h="80">
      <Center w="100%">
        <Box safeArea p={2} py={10} w="95%">
          <Heading size="lg" fontWeight="600">
            Добро пожаловать
          </Heading>

          <Heading mt={1} fontWeight="medium" size="xs">
            Авторизируйтесь чтобы продолжить!
          </Heading>

          <Center my={36}>
            <MaterialIcons name={'fitness-center'} size={98} color="gray" />
          </Center>

          <Formik<ILoginFormValues>
            initialValues={{ login: '', password: '' }}
            onSubmit={onSubmit}
            validateOnChange
            validate={validate}
          >
            {formik => (
              <VStack w="100%" space={3}>
                <InputWithIcon
                  label="Имя пользователя"
                  isDisabled={isLoading}
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

                <InputPassword
                  label="Пароль"
                  isDisabled={isLoading}
                  error={formik.errors.password}
                  value={formik.values.password}
                  isInvalid={Boolean(
                    formik.touched.password || formik.submitCount,
                  )}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  placeholder="Введите пароль"
                />

                {submitRequestError && (
                  <FormError message={submitRequestError} />
                )}

                <Link
                  alignSelf="flex-end"
                  onPress={getNavigateCallback('ForgetPassword')}
                >
                  Забыли пароль?
                </Link>

                <Button
                  mt={6}
                  onPress={formik.handleSubmit}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Войти
                </Button>

                <HStack mt="6" justifyContent="center">
                  <Text fontSize="sm">Я новый пользователь. </Text>

                  <Link onPress={getNavigateCallback('Registration')}>
                    Зарегистрироваться
                  </Link>
                </HStack>
              </VStack>
            )}
          </Formik>
        </Box>
      </Center>
    </ScrollView>
  );
};
