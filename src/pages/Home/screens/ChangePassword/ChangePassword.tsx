import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Button, Center, Icon, Text, VStack } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { selectAuthState } from '@src/selectors/auth';
import { useForm } from '@src/hooks/useForm';
import {
  confirmationPasswordValidate,
  required,
  validatePassword,
} from '@src/validators/common';
import { InputPassword } from '@src/components/UI';
import { useAppDispatch } from '@src/redux/store';
import { changePassword } from '@src/redux/actions/passwordActions';

interface IUpdatePasswordForm {
  password: string;
  currentPassword: string;
  confirmationPassword: string;
}

const UPDATE_PASSWORD_FORM_INITIAL_VALUES: IUpdatePasswordForm = {
  password: '',
  currentPassword: '',
  confirmationPassword: '',
};

export const CHANGE_PASSWORD_ERRORS_MAPPER: Record<
  string,
  Partial<IUpdatePasswordForm>
> = {
  INVALID_CURRENT_PASSWORD: {
    currentPassword: 'Неверный текущий пароль',
  },
};

enum PageState {
  Request,
  Success,
}

export const ChangePassword: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const [pageState, setPageState] = useState(PageState.Request);

  const { isLoading } = useSelector(selectAuthState);

  const submitCallback = async ({
    password,
    currentPassword,
  }: IUpdatePasswordForm) => {
    await dispatch(changePassword({ password, currentPassword })).unwrap();

    setPageState(PageState.Success);
  };

  const { validate, onSubmit } = useForm<IUpdatePasswordForm>({
    submitCallback: submitCallback,
    fieldsValidators: {
      password: [required, validatePassword],
      currentPassword: [required, validatePassword],
      confirmationPassword: [required, validatePassword],
    },
    formValidator: confirmationPasswordValidate,
    errorMapper: CHANGE_PASSWORD_ERRORS_MAPPER,
  });

  return (
    <PageLayout>
      {pageState !== PageState.Success && (
        <>
          <Text fontSize={20} fontWeight={600}>
            Изменение пароля
          </Text>

          <Text fontSize={18} fontWeight={300} mt={1}>
            Следуйте инструкциям
          </Text>

          <Center width="100%" my={36}>
            <MaterialIcons name={'vpn-key'} size={98} color="gray" />
          </Center>
        </>
      )}

      {pageState === PageState.Request && (
        <Formik<IUpdatePasswordForm>
          initialValues={UPDATE_PASSWORD_FORM_INITIAL_VALUES}
          onSubmit={onSubmit}
          validate={validate}
        >
          {formik => (
            <VStack width="100%" mt={3}>
              <InputPassword
                mb={8}
                label="Текущий пароль"
                isDisabled={isLoading}
                error={formik.errors.currentPassword}
                value={formik.values.currentPassword}
                isInvalid={Boolean(
                  formik.touched.currentPassword || formik.submitCount,
                )}
                onChangeText={formik.handleChange('currentPassword')}
                onBlur={formik.handleBlur('currentPassword')}
                placeholder="Введите текущий пароль"
              />

              <InputPassword
                mb={4}
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

              <InputPassword
                label="Подтвердите пароль"
                isDisabled={isLoading}
                error={formik.errors.confirmationPassword}
                value={formik.values.confirmationPassword}
                isInvalid={Boolean(
                  formik.touched.confirmationPassword || formik.submitCount,
                )}
                onChangeText={formik.handleChange('confirmationPassword')}
                onBlur={formik.handleBlur('confirmationPassword')}
                placeholder="Подтвердите пароль"
              />

              <Button
                mt={10}
                width="100%"
                isDisabled={formik.isSubmitting}
                isLoading={isLoading || formik.isSubmitting}
                onPress={formik.handleSubmit}
              >
                Изменить пароль
              </Button>
            </VStack>
          )}
        </Formik>
      )}

      {pageState === PageState.Success && (
        <Center width="100%" my={30}>
          <Icon
            size={160}
            as={<MaterialIcons name={'check-circle-outline'} />}
          />

          <Text my={16}>Пароль успешно обновлен. </Text>

          <Button width="100%" onPress={navigation.goBack}>
            Назад
          </Button>
        </Center>
      )}
    </PageLayout>
  );
};
