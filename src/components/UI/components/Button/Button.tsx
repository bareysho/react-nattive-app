import React, { FC, ReactElement, ReactNode, useState } from 'react';
import styled, { css } from 'styled-components/native';
import { ButtonProps } from 'react-native';
import { SimpleInterpolation } from 'styled-components';

import { getButtonBackgroundColor } from '@src/components/UI/utils/common';

import { HStack, Spinner, Text } from '../..';
import { baseElementCss } from '../../css/baseElementCss';
import { IBackground, IBaseElementStyleProps, IText } from '../../types/common';
import { TextExternalProps } from '../../components/Text/Text';

interface IButton {
  children?: ReactNode | string;
  isDisabled?: boolean;
  isLoading?: boolean;
  backgroundColorPressed?: string;
  onPress?: () => void;
  variant?: 'ghost' | 'solid';
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  _text?: TextExternalProps;
}

const ghostButtonCss = css`
  padding: 0 4px;
  elevation: 0;
`;

const STYLES_MAPPER: Record<string, ReadonlyArray<SimpleInterpolation>> = {
  ghost: ghostButtonCss,
};

const ButtonStyled = styled.Pressable<
  IButton & ButtonProps & IBaseElementStyleProps & { pressed: boolean }
>`
  ${baseElementCss}
  ${({ variant = 'solid' }) => STYLES_MAPPER[variant] || {}}
`;

export const Button: FC<IButton & IBaseElementStyleProps> = ({
  children,
  onPress,
  isDisabled,
  isLoading,
  minHeight = 26,
  variant = 'solid',
  p = 2,
  px = 5,
  shadow = 1,
  rounded = 8,
  backgroundColor = '#ffe502',
  backgroundColorPressed = '#facc15',
  leftIcon,
  rightIcon,
  _text = {},
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);

  const mapperTExtProps: Record<string, IText & IBackground> = {
    ghost: {
      textDecoration: 'underline',
      color: pressed ? '#a3a3a3' : _text?.color,
      fontSize: _text?.fontSize || 14,
    },
    solid: {
      fontSize: _text?.fontSize || 14,
      color: isLoading || isDisabled ? '#a3a3a3' : _text?.color,
    },
  };

  const mapperBackgroundColor: Record<string, IBackground> = {
    solid: {
      backgroundColor: getButtonBackgroundColor({
        disabled: isLoading || isDisabled,
        pressed,
        pressedColor: backgroundColorPressed,
        disabledColor: '#a1a1aa',
        normalColor: backgroundColor,
      }),
    },
    ghost: {
      backgroundColor: getButtonBackgroundColor({
        disabled: isLoading || isDisabled,
        pressed,
        disabledColor: '#a1a1aa',
        normalColor: 'transparent',
      }),
    },
  };

  const textProps: IText = {
    ..._text,
    ...mapperTExtProps[variant],
  };

  const possibleStringToText = (possibleString: ReactNode, index = 0) => {
    if (typeof possibleString === 'string') {
      return (
        <Text key={index} {...textProps}>
          {possibleString}
        </Text>
      );
    }

    return possibleString;
  };

  const generateContent = () => {
    if (typeof children === 'string') {
      return possibleStringToText(children);
    }

    if (Array.isArray(children)) {
      return children.map(possibleStringToText);
    }

    return children;
  };

  return (
    <ButtonStyled
      {...rest}
      {...mapperBackgroundColor[variant]}
      p={p}
      px={px}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      title=""
      pressed={pressed}
      shadow={shadow}
      isDisabled={isDisabled}
      isLoading={isLoading}
      rounded={rounded}
      variant={variant}
      disabled={isDisabled || isLoading}
      justifyContent="center"
      alignItems="center"
      onPress={onPress}
    >
      <HStack minHeight={minHeight} alignItems="center">
        {leftIcon}

        <HStack alignItems={'center'}>
          {generateContent()}

          {isLoading && <Spinner ml={2} color="#a3a3a3" />}
        </HStack>

        {rightIcon}
      </HStack>
    </ButtonStyled>
  );
};
