import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { ONLY_DIGIT } from '@src/constants/regexp';

import {
  FormControlWrapper,
  IInputForm,
} from '../FormControlWrapper/FormControlWrapper';
import { separateInputProps } from '../../utils/common';
import { Box, HStack, Input, Pressable } from '../../';

import { IInput } from './Input';

interface IInputOtpCode {
  maximumLength: number;
  setIsPinReady: (value: boolean) => void;
}
export const InputOtp: FC<IInputOtpCode & IInput & IInputForm> = ({
  maximumLength = 6,
  setIsPinReady,
  onChangeText: setCode,
  value: code = '',
  isDisabled,
  isInvalid,
  error,
  ...rest
}) => {
  const { inputProps, wrapperProps } = separateInputProps(rest);

  const isInputInvalid = Boolean(isInvalid && error);

  const inputRef = useRef<TextInput | null>(null);

  const boxArray = new Array(maximumLength).fill(0);

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  useEffect(() => {
    setIsPinReady(code?.length === maximumLength);

    return () => {
      setIsPinReady(false);
    };
  }, [code, maximumLength, setIsPinReady]);

  const handleOnPress = useCallback(() => {
    setIsInputBoxFocused(true);
    inputRef.current?.focus();
  }, []);

  const handleOnBlur = useCallback(() => {
    setIsInputBoxFocused(false);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      if (setCode && value.match(ONLY_DIGIT)) {
        setCode(value);
      }
    },
    [setCode],
  );

  const boxDigit = useCallback(
    (_: number, index: number) => {
      const emptyInput = '';
      const digit = code[index] || emptyInput;

      const isCurrentValue = index === code.length;
      const isLastValue = index === maximumLength - 1;
      const isCodeComplete = code.length === maximumLength;

      const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

      return (
        <Box justifyContent="space-between" key={index}>
          <Input
            {...inputProps}
            width={42}
            pl={0}
            value={digit}
            isFocused={isInputBoxFocused && isValueFocused}
            isInvalid={isInputInvalid}
            isReadOnly
            isDisabled={isDisabled}
            textAlign="center"
          />
        </Box>
      );
    },
    [code, isInputBoxFocused, maximumLength, isDisabled, isInputInvalid],
  );

  return (
    <FormControlWrapper
      {...wrapperProps}
      error={error}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <HStack width="100%" justifyContent="space-between">
          {boxArray.map(boxDigit)}
        </HStack>

        {!isDisabled && (
          <Input
            position="absolute"
            keyboardType="numeric"
            caretHidden={true}
            contextMenuHidden={true}
            selectTextOnFocus={false}
            opacity={0}
            value={code}
            isDisabled={isDisabled}
            ref={inputRef}
            maxLength={maximumLength}
            onChangeText={handleChange}
            onPressIn={handleOnPress}
            onBlur={handleOnBlur}
          />
        )}
      </Pressable>
    </FormControlWrapper>
  );
};
