import React, { FC, useCallback, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Icon, Pressable } from 'native-base';

import { IInput, Input } from './Input';

export const InputPassword: FC<IInput> = ({ ...inputProps }) => {
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
    <Input
      {...inputProps}
      type={show ? 'text' : 'password'}
      InputRightElement={
        <Pressable onPress={handleChangeType}>
          <Icon
            as={<MaterialIcons name={show ? 'visibility-off' : 'visibility'} />}
            size={5}
            mr="2"
          />
        </Pressable>
      }
      placeholder={inputProps.placeholder || 'Введите пароль'}
    />
  );
};
