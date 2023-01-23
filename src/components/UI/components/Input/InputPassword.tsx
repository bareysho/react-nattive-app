import React, { FC, useCallback, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Icon, InputControlled, Pressable } from '../..';
import { IInputForm } from '../FormControlWrapper/FormControlWrapper';

import { IInput } from './Input';

export const InputPassword: FC<IInput & IInputForm> = ({ ...inputProps }) => {
  const [show, setShow] = React.useState(false);

  const handleChangeType = useCallback(() => {
    if (!inputProps.isDisabled) {
      setShow(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    if (inputProps.isDisabled) {
      setShow(false);
    }
  }, [inputProps.isDisabled]);

  return (
    <InputControlled
      {...inputProps}
      type={show ? 'text' : 'password'}
      InputRightElement={
        <Pressable onPress={handleChangeType}>
          <Icon
            as={<MaterialIcons name={show ? 'visibility-off' : 'visibility'} />}
            size={20}
          />
        </Pressable>
      }
      placeholder={inputProps.placeholder || 'Введите пароль'}
    />
  );
};
