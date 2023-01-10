import React, { FC } from 'react';
import { Text } from 'react-native-paper';

import { FullSpaceContainer } from '@src/components/FullSpaceContainer';

export const Settings: FC = () => {
  return (
    <FullSpaceContainer>
      <Text variant="headlineMedium">Settings!</Text>
    </FullSpaceContainer>
  );
};
