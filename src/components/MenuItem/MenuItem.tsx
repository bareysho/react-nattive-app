import React, { FC, ReactElement } from 'react';
import { GestureResponderEvent } from 'react-native';
import { HStack, Icon, Pressable, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IMenuItem {
  title: string;
  icon: ReactElement;
  rightIcon?: ReactElement;
  callback: (event: GestureResponderEvent) => void | Promise<void>;
}

export const MenuItem: FC<IMenuItem> = ({
  icon,
  rightIcon,
  title,
  callback,
}) => {
  return (
    <Pressable
      _pressed={{
        opacity: 0.6,
      }}
      mb={1}
      onPress={callback}
    >
      <HStack h={12} justifyContent="space-between" alignItems="center">
        <HStack alignItems="center">
          <Icon mr={3} size={6} as={icon} />

          <Text fontSize={14}>{title}</Text>
        </HStack>

        <Icon
          mr={2}
          size={6}
          as={rightIcon || <MaterialIcons name="keyboard-arrow-right" />}
        />
      </HStack>
    </Pressable>
  );
};
