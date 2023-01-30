import React, { FC } from 'react';

import { Input } from '../..';
import { separateInputProps } from '../../utils/common';
import {
  FormControlWrapper,
  IInputForm,
} from '../FormControlWrapper/FormControlWrapper';

import { IInput } from './Input';

export const InputControlled: FC<IInput & IInputForm> = ({
  error,
  isInvalid,
  isDisabled,
  width = '100%',
  type = 'text',
  mb = 5,
  ...rest
}) => {
  const { inputProps, wrapperProps } = separateInputProps(rest);

  const isInputInvalid = Boolean(isInvalid && error);

  return (
    <FormControlWrapper
      {...wrapperProps}
      mb={mb}
      error={error}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      <Input
        {...inputProps}
        type={type}
        isDisabled={isDisabled}
        isInvalid={isInputInvalid}
        width={width}
      />
    </FormControlWrapper>
  );
};
