import React, { FC, ReactElement, ReactNode, useState } from 'react';
import styled, { css } from 'styled-components/native';
import { ButtonProps } from 'react-native';
import { SimpleInterpolation } from 'styled-components';

import { getButtonBackgroundColor } from '@src/components/UI/utils/common';
import { LIGHT_PRIMARY_COLORS } from '@src/components/UI/components/ThemeProvider/lightPrimary';

import { HStack, Spinner, Text, useTheme } from '../..';
import { baseElementCss } from '../../css/baseElementCss';
import { IBaseElementStyleProps, IText } from '../../types/common';
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
  p,
  px = 5,
  shadow = 1,
  rounded = 8,
  backgroundColor,
  backgroundColorPressed,
  leftIcon,
  rightIcon,
  _text = {},
  ...rest
}) => {
  const [pressed, setPressed] = useState(false);

  const { theme } = useTheme();

  const mapperTextProps: Record<string, IText & IBaseElementStyleProps> = {
    ghost: {
      textDecoration: 'underline',
      color: pressed ? '#a3a3a3' : _text?.color,
      p: p || 0,
    },
    solid: {
      color:
        isLoading || isDisabled
          ? LIGHT_PRIMARY_COLORS.disabledText
          : _text?.color || LIGHT_PRIMARY_COLORS.text,
      p: p || 2,
    },
  };

  const mapperBackgroundColor: Record<string, IBaseElementStyleProps> = {
    solid: {
      backgroundColor: getButtonBackgroundColor({
        disabled: isLoading || isDisabled,
        pressed,
        pressedColor: backgroundColorPressed || theme.primaryPressed,
        disabledColor: theme.disabled,
        normalColor: backgroundColor || theme.primary,
      }),
    },
    ghost: {
      backgroundColor: getButtonBackgroundColor({
        disabled: isLoading || isDisabled,
        pressed,
        normalColor: 'transparent',
      }),
    },
  };

  const textProps: IText = {
    ..._text,
    ...mapperTextProps[variant],
    fontSize: _text?.fontSize || 14,
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

          {isLoading && <Spinner ml={2} color={textProps.color} />}
        </HStack>

        {rightIcon}
      </HStack>
    </ButtonStyled>
  );
};
