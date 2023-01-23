import React, { FC, ReactElement } from 'react';

import { IBaseElementStyleProps } from '@src/components/UI/types/common';
import { Box } from '@src/components/UI';

interface IIcon {
  as: ReactElement;
}
export const Icon: FC<IIcon & IBaseElementStyleProps> = ({
  as,
  color = '#a8a29e',
  size = 20,
  ...rest
}) => {
  return <Box {...rest}>{React.cloneElement(as, { size, color })}</Box>;
};
