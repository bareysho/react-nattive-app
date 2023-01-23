import React from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { HStack, Icon, Pressable, Text } from '@src/components/UI';

export const ApplicationBar = ({
  navigation,
  options,
}: NativeStackHeaderProps) => {
  return (
    <>
      <HStack
        px={4}
        py={2}
        height={60}
        shadow={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack alignItems="center">
          <Pressable onPress={navigation.goBack}>
            <Icon mr={4} as={<MaterialIcons name="arrow-back-ios" />} />
          </Pressable>

          <Text fontSize={16}>{options.title}</Text>
        </HStack>
      </HStack>
    </>
  );
};
