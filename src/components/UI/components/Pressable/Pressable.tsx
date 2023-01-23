import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Pressable as PressableRN, PressableProps } from 'react-native';

import { baseElementCss } from '@src/components/UI/css/baseElementCss';
import { IBaseElementStyleProps } from '@src/components/UI/types/common';

const PressableStyled = styled(PressableRN)<
  IBaseElementStyleProps & PressableProps
>`
  ${baseElementCss}
`;

interface IPressable {
  pressedBackgroundColor?: string;
}

export const Pressable: FC<
  IPressable & PressableProps & IBaseElementStyleProps
> = ({ children, pressedBackgroundColor, backgroundColor, ...rest }) => {
  return (
    <PressableStyled
      style={({ pressed }) =>
        pressed
          ? { backgroundColor: pressedBackgroundColor, opacity: 0.6 }
          : { backgroundColor }
      }
      {...rest}
    >
      {children}
    </PressableStyled>
  );
};
