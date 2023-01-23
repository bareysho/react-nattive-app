import React, { FC, ReactElement } from 'react';

import { Button } from '../..';
import { IBaseElementStyleProps } from '../../types/common';

interface IFab extends IBaseElementStyleProps {
  icon: ReactElement;
}
export const Fab: FC<IFab> = ({ icon, size = 50, ...rest }) => {
  return (
    <Button
      {...rest}
      position="absolute"
      size={size}
      px={0}
      bottom={20}
      right={20}
      shadow={1}
      rounded={size / 2}
      leftIcon={icon}
    />
  );
};
