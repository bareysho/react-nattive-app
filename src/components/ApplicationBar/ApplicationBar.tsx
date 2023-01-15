import React from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { HStack, Icon, Pressable, Text, useColorMode } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppDispatch } from '@src/redux/store';
import { useThemedBgColor } from '@src/hooks/useThemedBgColor';
import { logoutAction } from '@src/redux/actions/authActions';

export const ApplicationBar = (props: NativeStackHeaderProps) => {
  const dispatch = useAppDispatch();

  const { toggleColorMode } = useColorMode();

  const bg = useThemedBgColor();

  return (
    <>
      <HStack
        bg={bg}
        px={4}
        py={2}
        shadow={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack alignItems="center">
          <Text fontSize={16}>{props.options.title}</Text>
        </HStack>

        <HStack>
          <Pressable onPress={toggleColorMode} w={10}>
            <Icon as={MaterialCommunityIcons} name="weather-night" size="lg" />
          </Pressable>

          <Pressable w={10}>
            <Icon as={MaterialCommunityIcons} name="cog-outline" size="lg" />
          </Pressable>

          <Pressable
            onPress={async () => {
              await dispatch(logoutAction());
            }}
          >
            <Icon as={MaterialCommunityIcons} name="exit-to-app" size="lg" />
          </Pressable>
        </HStack>
      </HStack>
    </>
  );
};
