import React, { FC, PropsWithChildren, useContext } from 'react';
import { Box, Center, ScrollView, Spinner } from 'native-base';

import { ScreenLoadingContext } from '@src/providers/ScreenLoadingProvider';
import { useThemedBgColor } from '@src/hooks/useThemedBgColor';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isScreenLoading } = useContext(ScreenLoadingContext);

  const bg = useThemedBgColor();

  return isScreenLoading ? (
    <Center bg={bg} alignItems="center" flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <ScrollView h="80" bg={bg}>
      <Center w="100%">
        <Box safeArea p={2} py={6} w="95%">
          {children}
        </Box>
      </Center>
    </ScrollView>
  );
};
