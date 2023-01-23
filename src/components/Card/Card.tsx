import React, { FC } from 'react';

import { Box } from '@src/components/UI';
import { IStackContainer } from '@src/components/UI/components/Stack/Stack';

export const Card: FC<IStackContainer> = ({ children, width, ...boxProps }) => {
  return (
    <Box
      {...boxProps}
      shadow={1}
      mt={6}
      p={4}
      rounded={10}
      width={width || '100%'}
      backgroundColor="#e7e5e4"
    >
      {children}
    </Box>
  );
};
