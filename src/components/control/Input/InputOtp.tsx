import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  HStack,
  Input,
  Pressable,
  WarningOutlineIcon,
} from 'native-base';
import { Keyboard, TextInput } from 'react-native';

import { ONLY_DIGIT } from '@src/constants/regexp';

import { IInput } from './Input';

interface IInputOtpCode {
  maximumLength: number;
  setIsPinReady: (value: boolean) => void;
}
export const InputOtp: FC<IInputOtpCode & IInput> = ({
  maximumLength = 6,
  setIsPinReady,
  onChangeText: setCode,
  value: code = '',
  isDisabled,
  isInvalid,
  error,
  label,
  helpText,
  ...inputProps
}) => {
  const inputRef = useRef<TextInput | null>();

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
            w={12}
            value={digit}
            isFocused={isInputBoxFocused && isValueFocused}
            isReadOnly={false}
            isDisabled={isDisabled}
            textAlign="center"
          />
        </Box>
      );
    },
    [code, isInputBoxFocused, maximumLength],
  );

  return (
    <FormControl isDisabled={isDisabled} isInvalid={isInvalid && !!error}>
      <FormControl.Label mb={2}>{label}</FormControl.Label>

      <Pressable onPress={Keyboard.dismiss}>
        <HStack w="100%" justifyContent="space-between">
          {boxArray.map(boxDigit)}
        </HStack>

        {!isDisabled && (
          <Input
            {...inputProps}
            opacity={0}
            position="absolute"
            keyboardType="numeric"
            caretHidden={true}
            contextMenuHidden={true}
            selectTextOnFocus={false}
            pl="100%"
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

      {helpText && <FormControl.HelperText>{helpText}</FormControl.HelperText>}

      {error !== ' ' && (
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {error}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};
