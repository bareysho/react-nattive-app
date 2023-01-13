import React, { FC } from 'react';
import { FormControl, WarningOutlineIcon } from 'native-base';

interface IFormError {
  message: string;
}
export const FormError: FC<IFormError> = ({ message }) => {
  return (
    <FormControl isInvalid>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {message}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};
