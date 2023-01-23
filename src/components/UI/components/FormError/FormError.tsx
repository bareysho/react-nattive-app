import React, { FC } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { HStack, Icon, Text } from '@src/components/UI';

interface IFormError {
  message?: string;
}

export const FormError: FC<IFormError> = ({ message }) => {
  return message ? (
    <HStack mt={2} alignItems="center">
      <Icon
        color="#dc2626"
        mr={1}
        size={14}
        as={<MaterialIcons name="error-outline" />}
      />

      <Text fontSize={12} color="#dc2626">
        {message}
      </Text>
    </HStack>
  ) : (
    <></>
  );
};
