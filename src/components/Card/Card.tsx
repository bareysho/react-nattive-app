import React, { FC, ReactNode } from 'react';
import { Box, IBoxProps } from 'native-base';
import { useColorModeValue } from 'native-base/src/core/color-mode/hooks';

interface ICard extends IBoxProps {
  children: ReactNode;
}
export const Card: FC<ICard> = ({ children, ...boxProps }) => {
  const bg = useColorModeValue('warmGray.100', 'trueGray.600');

  return (
    <Box {...boxProps} shadow={1} mt={6} p={4} rounded={10} bg={bg}>
      {children}
    </Box>
  );
};
