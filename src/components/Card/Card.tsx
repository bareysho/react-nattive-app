import React, { FC } from 'react';

import { Pressable, useTheme } from '@src/components/UI';
import { IPressableProps } from '@src/components/UI/components/Pressable/Pressable';

export const Card: FC<IPressableProps> = ({
  children,
  width,
  backgroundColor,
  p,
  ...boxProps
}) => {
  const { theme } = useTheme();

  return (
    <Pressable
      {...boxProps}
      shadow={1}
      p={p || 4}
      disabled={!boxProps.onPress}
      rounded={10}
      width={width || '100%'}
      backgroundColor={backgroundColor || theme.cardBackground}
    >
      {children}
    </Pressable>
  );
};
