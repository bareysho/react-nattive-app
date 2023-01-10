import { Text, useTheme } from 'react-native-paper';
import React from 'react';

import { FullSpaceContainer } from '@src/components/FullSpaceContainer';

export const Main = () => {
  const theme = useTheme();

  return (
    <FullSpaceContainer
      styles={{
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="headlineMedium">Home!</Text>
    </FullSpaceContainer>
  );
};
