import React from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { HStack, Icon, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useThemedBgColor } from '@src/hooks/useThemedBgColor';

export const ApplicationBar = ({
  navigation,
  options,
}: NativeStackHeaderProps) => {
  const bg = useThemedBgColor();

  return (
    <>
      <HStack
        bg={bg}
        px={4}
        py={2}
        height={60}
        shadow={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack alignItems="center">
          <Icon
            onPress={navigation.goBack}
            mr={4}
            as={<MaterialIcons name="arrow-back-ios" />}
          />

          <Text fontSize={16}>{options.title}</Text>
        </HStack>
      </HStack>
    </>
  );
};
