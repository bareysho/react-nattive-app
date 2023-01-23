import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';

import { IBaseElementStyleProps } from '../../types/common';
import { Box } from '../..';

export const Spinner: FC<IBaseElementStyleProps> = ({
  color = '#ffe502',
  size = 20,
  height,
  width,
  ...rest
}) => {
  return (
    <Box {...rest} color={color} size={size} height={height} width={width}>
      <ActivityIndicator color={color} size={size} />
    </Box>
  );
};
