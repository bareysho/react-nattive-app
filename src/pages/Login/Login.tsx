import React, { FC, useCallback } from 'react';
import { Button, Card, Text, TextInput, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikErrors } from 'formik';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import { Link, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { selectAuthState } from '@src/selectors/auth';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { login } from '@src/redux/slices/auth';
import {
  FieldValidator,
  onlyLatin,
  required,
  Value,
} from '@src/validators/common';
import { isStringType } from '@src/utils/checkType';

export const LOGIN_ERRORS_MAPPER: Record<string, Partial<ILoginFormValues>> = {
  INVALID_CREDENTIALS_ERROR: {
    password: 'Неверное имя пользователя или пароль',
  },
};

interface ILoginFormValues {
  login: string;
  password: string;
}

const styles = StyleSheet.create({
  pageTitle: {
    marginVertical: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  formTitle: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  textError: {
    marginTop: 4,
    marginBottom: 16,
  },
  button: {
    marginVertical: 30,
  },
  inputContainerStyle: {
    width: '100%',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  rowStart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  link: {
    marginRight: 30,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export const Login: FC<StackScreenProps<ParamListBase>> = ({ navigation }) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector(selectAuthState);

  const composeValidators = useCallback(
    (validators: FieldValidator[]) => (value: Value) =>
      (validators || []).reduce<string | undefined>(
        (error, validator) => error || validator(value),
        undefined,
      ),
    [],
  );

  return (
    <Formik<ILoginFormValues>
      initialValues={{ login: '', password: '' }}
      onSubmit={async ({ login: username, password }, formikHelpers) => {
        try {
          await dispatch(login({ username, password })).unwrap();

          navigation.navigate('Home');
        } catch (axiosError) {
          const { message: errorsObj } = axiosError as { message: unknown };

          let errors = null;

          if (isStringType(errorsObj)) {
            errors = LOGIN_ERRORS_MAPPER[errorsObj as string];
          } else if (errorsObj) {
            errors = (errorsObj as string[]).reduce((accumErrors, error) => {
              return { ...accumErrors, ...LOGIN_ERRORS_MAPPER[error] };
            }, {});
          }

          if (errors) {
            formikHelpers.setSubmitting(false);
            formikHelpers.setErrors(errors);
          }
        }
      }}
      validateOnChange
      validate={values => {
        const errors: FormikErrors<ILoginFormValues> = {};

        const loginError = composeValidators([required, onlyLatin])(
          values.login,
        );
        const passwordError = composeValidators([required])(values.password);

        if (loginError) {
          errors.login = loginError;
        }

        if (passwordError) {
          errors.password = passwordError;
        }

        return errors;
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
        return (
          <View style={styles.inputContainerStyle}>
            <Text style={styles.pageTitle} variant="displaySmall">
              My working plan
            </Text>

            <View style={styles.iconContainer}>
              <Icon
                name={'playlist-add-check'}
                size={140}
                color={theme.colors.secondary}
              />

              <Icon
                name={'fitness-center'}
                size={140}
                color={theme.colors.secondary}
              />
            </View>

            <Text style={styles.formTitle} variant="headlineSmall">
              Авторизация
            </Text>

            <Card style={styles.card}>
              <TextInput
                mode="outlined"
                label="Имя пользователя"
                placeholder="Введите имя пользователя"
                onChangeText={handleChange('login')}
                onBlur={handleBlur('login')}
                value={values.login}
                disabled={isLoading}
              />

              <Text style={styles.textError} variant="labelMedium">
                {errors.login}
              </Text>

              <TextInput
                mode="outlined"
                label="Пароль"
                secureTextEntry
                placeholder="Введите пароль"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                disabled={isLoading}
              />

              <Text style={styles.textError} variant="labelMedium">
                {errors.password}
              </Text>

              <View style={styles.rowStart}>
                <Link style={styles.link} to="/ForgetPassword">
                  Забыли пароль?
                </Link>

                <Link to="/Registration">Регистрация</Link>
              </View>
            </Card>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained-tonal"
                style={styles.button}
                onPress={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
              >
                Подтвердить
              </Button>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};
