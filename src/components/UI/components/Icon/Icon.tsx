import React, { FC, ReactElement } from 'react';

import { IBaseElementStyleProps } from '@src/components/UI/types/common';
import { Box, useTheme } from '@src/components/UI';

interface IIcon {
  as: ReactElement;
}
export const Icon: FC<IIcon & IBaseElementStyleProps> = ({
  as,
  color,
  size = 20,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <Box {...rest}>
      {React.cloneElement(as, { size, color: color || theme.iconColor })}
    </Box>
  );
};
