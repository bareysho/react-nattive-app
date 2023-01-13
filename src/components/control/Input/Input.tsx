import React, { FC, ReactElement } from 'react';
import { Input as InputUI, FormControl, WarningOutlineIcon } from 'native-base';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

export interface IInput {
  type?: 'text' | 'password';
  label?: string;
  value?: string;
  error?: string;
  placeholder?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  helpText?: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (e: string) => void;
  InputRightElement?: ReactElement;
  InputLeftElement?: ReactElement;
}

export const Input: FC<IInput> = ({
  type = 'text',
  label,
  placeholder,
  error,
  isInvalid,
  isDisabled,
  helpText,
  value,
  onBlur,
  onChangeText,
  InputRightElement,
  InputLeftElement,
}) => {
  return (
    <FormControl isDisabled={isDisabled} isInvalid={isInvalid && !!error}>
      <FormControl.Label>{label}</FormControl.Label>

      <InputUI
        type={type}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
        InputRightElement={InputRightElement}
        InputLeftElement={InputLeftElement}
      />

      {helpText && <FormControl.HelperText>{helpText}</FormControl.HelperText>}

      {error !== ' ' && (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {error}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};
