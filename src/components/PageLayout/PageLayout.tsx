import React, { FC, PropsWithChildren, useContext } from 'react';
import { ScrollView } from 'react-native';

import { Box, Center, Spinner } from '@src/components/UI';
import { ScreenLoadingContext } from '@src/providers/ScreenLoadingProvider';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isScreenLoading } = useContext(ScreenLoadingContext);

  return isScreenLoading ? (
    <Center flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <ScrollView
      style={{
        width: '100%',
      }}
    >
      <Box p={4}>{children}</Box>
    </ScrollView>
  );
};
