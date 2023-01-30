import React, { FC } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {HStack, Icon, Text, useTheme} from '@src/components/UI';

interface IFormError {
  message?: string;
}

export const FormError: FC<IFormError> = ({ message }) => {
  const { theme } = useTheme();

  return message ? (
    <HStack mt={2} alignItems="center">
      <Icon
        color={theme.error}
        mr={1}
        size={14}
        as={<MaterialIcons name="error-outline" />}
      />

      <Text fontSize={12} color={theme.error}>
        {message}
      </Text>
    </HStack>
  ) : (
    <></>
  );
};
