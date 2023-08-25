import React, {
  FC,
  MutableRefObject,
  ReactElement,
  Ref,
  useEffect,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { RuleSet } from 'styled-components';

import { Box, useTheme } from '@src/components/UI';

import { baseElementCss } from '../../css/baseElementCss';
import { IBaseElementStyleProps, IText } from '../../types/common';

export interface IInput extends TextInputProps, IBaseElementStyleProps, IText {
  isInvalid?: boolean;
  isDisabled?: boolean;
  isFocused?: boolean;
  isReadOnly?: boolean;
  type?: 'text' | 'password';
  ref?: (Ref<TextInput> | undefined) & MutableRefObject<TextInput | null>;
  InputRightElement?: ReactElement;
  InputLeftElement?: ReactElement;
}

enum InputState {
  Focused,
  Error,
  Disabled,
}

const focusCss = css`
  background-color: rgba(255, 229, 2, 0.2);
  border-color: #ffe502;
`;

const disabledCss = css`
  border-color: #e4e4e7;
  color: #a1a1aa;
`;

const errorCss = css`
  border-color: #dc2626;
`;

const INPUT_STYLE_BY_INPUT_STATE: Record<InputState, RuleSet<object>> = {
  [InputState.Focused]: focusCss,
  [InputState.Disabled]: disabledCss,
  [InputState.Error]: errorCss,
};

const ORDERED_STATES: InputState[] = [
  InputState.Focused,
  InputState.Error,
  InputState.Disabled,
];

const TextInputStyled = styled.TextInput<IInput & { inputState: InputState[] }>`
  ${baseElementCss}
  ${({ inputState }) =>
    ORDERED_STATES.map(state =>
      inputState.includes(state) ? INPUT_STYLE_BY_INPUT_STATE[state] : {},
    )}
`;

export const Input: FC<IInput> = ({
  children,
  placeholder,
  isInvalid,
  isDisabled,
  isFocused,
  isReadOnly,
  value,
  type = 'text',
  onBlur,
  onFocus,
  onChangeText,
  InputRightElement,
  InputLeftElement,
  pl = 4,
  pr = 0,
  backgroundColor = 'transparent',
  placeholderTextColor = '#a1a1aa',
  fontSize = 12,
  borderWidth = 1,
  color,
  borderColor,
  borderRadius = 5,
  height = 45,
  width = '100%',
  ...rest
}) => {
  const [inputState, setInputState] = useState<InputState[]>([]);

  const { theme } = useTheme();

  const addState = (state: InputState) => {
    setInputState(prev => [...prev, state]);
  };

  const removeState = (state: InputState) => {
    setInputState(prev => prev.filter(removedState => removedState !== state));
  };

  useEffect(() => {
    if (isDisabled) {
      addState(InputState.Disabled);
    } else {
      removeState(InputState.Disabled);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (isInvalid) {
      addState(InputState.Error);
    } else {
      removeState(InputState.Error);
    }
  }, [isInvalid]);

  useEffect(() => {
    if (isFocused) {
      addState(InputState.Focused);
    } else {
      removeState(InputState.Focused);
    }
  }, [isFocused]);

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    removeState(InputState.Focused);

    if (onBlur) onBlur(event);

    if (onChangeText && value) onChangeText(value.trim());
  };

  const handleFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    addState(InputState.Focused);

    if (onFocus) onFocus(event);
  };

  return (
    <Box width={width} position="relative" justifyContent="center">
      {InputLeftElement &&
        React.cloneElement(InputLeftElement, {
          position: 'absolute',
          left: 10,
          zIndex: 3,
        })}

      <TextInputStyled
        {...rest}
        secureTextEntry={type === 'password'}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!(isDisabled || isReadOnly)}
        placeholder={placeholder}
        inputState={inputState}
        placeholderTextColor={placeholderTextColor}
        value={value}
        height={height}
        width={width}
        color={color || theme.text}
        pl={InputLeftElement ? pl + 4 : pl}
        pr={InputRightElement ? pr + 4 : pr}
        backgroundColor={backgroundColor}
        fontSize={fontSize}
        borderWidth={borderWidth}
        rounded={borderRadius}
        borderColor={borderColor || theme.inputBorder}
        maxLength={40}
      />

      {InputRightElement &&
        React.cloneElement(InputRightElement, {
          position: 'absolute',
          right: 10,
          zIndex: 0,
        })}
    </Box>
  );
};
