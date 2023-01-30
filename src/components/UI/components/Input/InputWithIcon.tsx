import React, { FC } from 'react';

import { Icon } from '../Icon/Icon';
import { IInputForm } from '../FormControlWrapper/FormControlWrapper';

import { IInput } from './Input';
import { InputControlled } from './InputControlled';

export const InputWithIcon: FC<IInput & IInputForm> = ({
  InputLeftElement,
  InputRightElement,
  ...inputProps
}) => {
  return (
    <InputControlled
      {...inputProps}
      placeholder={inputProps.placeholder || 'Введите email'}
      InputLeftElement={
        InputLeftElement && <Icon as={InputLeftElement} size={20} />
      }
      InputRightElement={
        InputRightElement && <Icon as={InputRightElement} size={20} />
      }
    />
  );
};
