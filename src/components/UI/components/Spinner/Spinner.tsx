import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';

import { IBaseElementStyleProps } from '../../types/common';
import { Box, useTheme } from '../..';

export const Spinner: FC<IBaseElementStyleProps> = ({
  color,
  size = 20,
  height,
  width,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <Box
      {...rest}
      color={color || theme.primary}
      size={size}
      height={height}
      width={width}
    >
      <ActivityIndicator color={color || theme.primary} size={size} />
    </Box>
  );
};
