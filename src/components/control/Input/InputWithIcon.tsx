import React, { FC, ReactElement } from 'react';
import { Icon } from 'native-base';

import { Input, IInput } from './Input';

export const InputWithIcon: FC<IInput & { icon: ReactElement }> = ({
  icon,
  ...inputProps
}) => {
  return (
    <Input
      {...inputProps}
      placeholder={inputProps.placeholder || 'Введите email'}
      InputLeftElement={<Icon as={icon} size={5} ml="2" />}
    />
  );
};
