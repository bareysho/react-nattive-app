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
