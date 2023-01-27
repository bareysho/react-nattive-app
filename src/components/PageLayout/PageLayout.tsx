import React, { FC, PropsWithChildren, useContext } from 'react';

import { Box, Center, Spinner, useTheme } from '@src/components/UI';
import { ScreenLoadingContext } from '@src/providers/ScreenLoadingProvider';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isScreenLoading } = useContext(ScreenLoadingContext);

  const { theme } = useTheme();

  return isScreenLoading ? (
    <Center backgroundColor={theme.background} flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <Box width="100%" height="100%" backgroundColor={theme.background} p={4}>
      {children}
    </Box>
  );
};
