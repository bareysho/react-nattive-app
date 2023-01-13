import { FormikErrors } from 'formik';

import { getPluralIndex } from '@src/utils/plural';

export type Value = string | number | undefined;

export type FieldValidator = (value: Value) => string | undefined;

const validateRegexp = (value: Value, regexp: RegExp, error: string) => {
  const isInvalid = regexp.test(`${value || ''}`);

  return isInvalid ? undefined : error;
};

export const required = (value: Value) =>
  value ? undefined : 'Поле обязательно для заполнения';

export const onlyLatin = (value: Value) => {
  const onlyLatinRegexp = /^[a-zA-Z0-9()*_\-!#$%^&,."'\][]*$/;

  return validateRegexp(
    value,
    onlyLatinRegexp,
    'Поле может содержать буквы латинского алфавита и символы',
  );
};

export const validateEmail = (email: Value) => {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const lowerCaseEmail = String(email).toLowerCase();

  return validateRegexp(
    lowerCaseEmail,
    emailRegexp,
    'E-mail введен некорректно',
  );
};

export const minLength =
  (length: number, variants: string[]) => (value: Value) => {
    const pluralIndex = getPluralIndex(length);

    const minLengthText = `Минимум ${length}`;
    const symbolsPluralText = variants[pluralIndex];

    return `${value}`.length >= length
      ? undefined
      : `${minLengthText} ${symbolsPluralText}`;
  };

export const validatePassword = (value: Value) => {
  return minLength(6, ['символ', 'символа', 'символов'])(value);
};

interface IConfirmationPasswordValues {
  password: string;
  confirmationPassword: string;
}

export const confirmationPasswordValidate = (
  values: IConfirmationPasswordValues,
) => {
  const errors = {} as FormikErrors<IConfirmationPasswordValues>;

  const { password, confirmationPassword } = values;

  if (password && confirmationPassword && password !== confirmationPassword) {
    errors.password = ' ';
    errors.confirmationPassword = 'Введенные пароли не совпадают';
  }

  return errors;
};
