import React, { FC } from 'react';
import { Formik } from 'formik';
import { Button, VStack } from 'native-base';
import { useSelector } from 'react-redux';

import {
  confirmationPasswordValidate,
  required,
  validatePassword,
} from '@src/validators/common';
import { useForm } from '@src/hooks/useForm';
import { InputPassword } from '@src/components/control';
import { selectAuthState } from '@src/selectors/auth';
import { IUpdatePasswordForm } from '@src/types/form';

interface IUpdatePasswordFormParams {
  submitCallback: (values: IUpdatePasswordForm) => Promise<void>;
}

const UPDATE_PASSWORD_FORM_INITIAL_VALUES: IUpdatePasswordForm = {
  password: '',
  confirmationPassword: '',
};

export const UpdatePasswordForm: FC<IUpdatePasswordFormParams> = ({
  submitCallback,
}) => {
  const { isLoading } = useSelector(selectAuthState);

  const { validate, onSubmit } = useForm<IUpdatePasswordForm>({
    submitCallback: submitCallback,
    fieldsValidators: {
      password: [required, validatePassword],
      confirmationPassword: [required, validatePassword],
    },
    formValidator: confirmationPasswordValidate,
  });

  return (
    <Formik<IUpdatePasswordForm>
      initialValues={UPDATE_PASSWORD_FORM_INITIAL_VALUES}
      onSubmit={onSubmit}
      validate={validate}
    >
      {formik => (
        <VStack mt={5} space={2}>
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

          <InputPassword
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
            mt={5}
            isDisabled={formik.isSubmitting}
            isLoading={isLoading || formik.isSubmitting}
            onPress={formik.handleSubmit}
          >
            Изменить пароль
          </Button>
        </VStack>
      )}
    </Formik>
  );
};
