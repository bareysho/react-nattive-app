import React, { FC, ReactElement } from 'react';
import { GestureResponderEvent } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { HStack, Icon, Pressable, Text } from '@src/components/UI';

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
    <Pressable mb={1} px={2} width="100%" rounded={10} onPress={callback}>
      <HStack
        width="100%"
        height={46}
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack alignItems="center">
          <Icon mr={3} size={26} as={icon} />

          <Text fontSize={14}>{title}</Text>
        </HStack>

        <Icon
          size={26}
          as={rightIcon || <MaterialIcons name="keyboard-arrow-right" />}
        />
      </HStack>
    </Pressable>
  );
};
