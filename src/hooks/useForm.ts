import { useCallback, useState } from 'react';
import { FormikErrors, FormikHelpers } from 'formik';

import { FieldValidator, Value } from '@src/validators/common';
import { isStringType } from '@src/utils/checkType';

export const useForm = <T>({
  submitCallback,
  fieldsValidators,
  formValidator,
  errorMapper = {},
}: {
  submitCallback: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
  fieldsValidators?: Record<keyof T, FieldValidator[]>;
  formValidator?: (values: T) => FormikErrors<T>;
  errorMapper?: Record<string, FormikErrors<T>>;
}) => {
  const [submitRequestError, setSubmitRequestError] = useState('');

  const composeValidators = useCallback(
    (validators: FieldValidator[]) => (value: Value) =>
      (validators || []).reduce<string | undefined>(
        (error, validator) => error || validator(value),
        undefined,
      ),
    [],
  );

  const validateFields = (values: T): FormikErrors<T> => {
    if (fieldsValidators) {
      return Object.entries<FieldValidator[]>(fieldsValidators).reduce(
        (accum, [field, fieldValidators]) => {
          const error = composeValidators(fieldValidators)(
            values[field as keyof T] as Value,
          );

          if (error) {
            return {
              ...accum,
              [field]: error,
            };
          }

          return accum;
        },
        {} as FormikErrors<T>,
      );
    }

    return {};
  };

  const validateForm = (values: T): FormikErrors<T> => {
    if (formValidator) {
      return formValidator(values);
    }

    return {};
  };

  const validate = useCallback(
    (values: T): FormikErrors<T> => {
      const fieldsErrors = validateFields(values);
      const formErrors = validateForm(values);

      return { ...fieldsErrors, ...formErrors };
    },
    [composeValidators],
  );

  const onSubmit = useCallback(
    async (values: T, formikHelpers: FormikHelpers<T>): Promise<void> => {
      try {
        await submitCallback(values, formikHelpers);
      } catch (axiosError) {
        const { message: errorsObj } = axiosError as { message: unknown };

        let errors = null;

        if (isStringType(errorsObj)) {
          errors = errorMapper[errorsObj as string];
        } else if (errorsObj) {
          errors = (errorsObj as string[]).reduce((accumErrors, error) => {
            return { ...accumErrors, ...errorMapper[error] };
          }, {});
        }

        if (errors) {
          formikHelpers.setErrors(errors);
        } else {
          formikHelpers.setErrors(
            Object.keys(values as Record<string, unknown>).reduce(
              (accum, key) => ({ ...accum, [key]: ' ' }),
              {},
            ),
          );
          setSubmitRequestError('Что-то пошло не так попробуйте еще раз');
        }

        formikHelpers.setSubmitting(false);
      }
    },
    [submitCallback],
  );

  return {
    onSubmit,
    validate,
    submitRequestError,
  };
};
