import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { PressableProps } from 'react-native';

import { baseElementCss } from '@src/components/UI/css/baseElementCss';
import { IBaseElementStyleProps } from '@src/components/UI/types/common';
import { useTheme } from '@src/components/UI';

interface IPressable {
  isPressed?: boolean;
  pressedBackgroundColor?: string;
}

const PressableStyled = styled.Pressable<
  IPressable & PressableProps & IBaseElementStyleProps
>`
  ${baseElementCss}
  ${({ isPressed, pressedBackgroundColor, backgroundColor }) => {
    return isPressed
      ? { backgroundColor: pressedBackgroundColor }
      : { backgroundColor };
  }}
`;

export interface IPressableProps
  extends IPressable,
    PressableProps,
    IBaseElementStyleProps {}

export const Pressable: FC<
  IPressable & PressableProps & IBaseElementStyleProps
> = ({ children, pressedBackgroundColor, backgroundColor, ...rest }) => {
  const [isPressed, setPressed] = useState(false);

  const { theme } = useTheme();

  return (
    <PressableStyled
      {...rest}
      isPressed={isPressed}
      backgroundColor={backgroundColor || 'transparent'}
      pressedBackgroundColor={pressedBackgroundColor || theme.pressablePressed}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {children}
    </PressableStyled>
  );
};
