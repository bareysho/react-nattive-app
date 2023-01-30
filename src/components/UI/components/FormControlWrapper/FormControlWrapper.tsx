import React, { FC, PropsWithChildren } from 'react';

import { IBaseElementStyleProps } from '@src/components/UI/types/common';

import { FormError, Text, VStack } from '../..';

export interface IInputForm {
  isInvalid?: boolean;
  isDisabled?: boolean;
  label?: string;
  error?: string;
  helpText?: string;
}

export const FormControlWrapper: FC<
  PropsWithChildren<IInputForm & IBaseElementStyleProps>
> = ({
  children,
  label,
  error,
  isInvalid,
  isDisabled,
  helpText,
  width = '100%',
  ...rest
}) => {
  const isInputInvalid = Boolean(isInvalid && error);

  return (
    <VStack width={width} {...rest}>
      {label && (
        <Text mb={2} fontSize={14}>
          {label}
        </Text>
      )}

      {children}

      {helpText && (
        <Text mt={2} fontSize={12} color="#71717a">
          {helpText}
        </Text>
      )}

      {!isDisabled && isInputInvalid && error !== ' ' && (
        <FormError message={error} />
      )}
    </VStack>
  );
};
