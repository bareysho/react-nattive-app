import React, { FC } from 'react';

import { Box } from '../Stack/Stack';
import { IBaseElementStyleProps } from '../../types/common';

interface IProgress {
  value: number;
  progressLineColor?: string;
}

export const Progress: FC<IProgress & IBaseElementStyleProps> = ({
  progressLineColor,
  value,
  backgroundColor = '#e5e5e5',
  rounded = 4,
  height = 8,
  width = 100,
  ...rest
}) => {
  return (
    <Box
      {...rest}
      backgroundColor={backgroundColor}
      rounded={rounded}
      height={height}
      width={width}
    >
      <Box
        height={height}
        rounded={rounded}
        backgroundColor={progressLineColor}
        width={`${value}%`}
      />
    </Box>
  );
};
