import React, { FC, ReactElement, useMemo } from 'react';
import { ParamListBase } from '@react-navigation/native';
import {
  Box,
  Center,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useThemedBgColor } from '@src/hooks/useThemedBgColor';

import { Workouts, Profile, Statistics, Dashboard } from './screens';

interface IRoutesConfig {
  key: string;
  title: string;
  focusedIcon: string;
  content: ReactElement;
}

export const Home: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const routes: IRoutesConfig[] = useMemo(
    () => [
      {
        key: 'application',
        title: 'Сводка',
        focusedIcon: 'application-outline',
        content: <Dashboard />,
      },
      {
        key: 'arm-flex',
        title: 'Тренировка',
        focusedIcon: 'arm-flex-outline',
        content: <Workouts />,
      },
      {
        key: 'chart-box',
        title: 'Статистика',
        focusedIcon: 'chart-box-outline',
        content: <Statistics />,
      },
      {
        key: 'account',
        title: 'Профиль',
        focusedIcon: 'account-outline',
        content: <Profile navigate={navigation.navigate} />,
      },
    ],
    [],
  );

  const [selectedTab, setSelectedTab] = React.useState(0);

  const bg = useThemedBgColor();

  return (
    <VStack w="100%" justifyContent="space-between" flex={1}>
      <Box height="92%">{routes[selectedTab].content}</Box>

      <HStack
        height="8%"
        zIndex={3}
        bg={bg}
        alignItems="center"
        safeAreaBottom
        shadow={6}
      >
        {routes.map((route, index) => {
          const isActive = selectedTab === index;

          const opacity = isActive ? 1 : 0.5;
          const name = isActive ? route.key : route.focusedIcon;

          const handleSelect = () => setSelectedTab(index);

          return (
            <Pressable
              key={route.key}
              opacity={opacity}
              py={2}
              flex={1}
              onPress={handleSelect}
            >
              <Center alignItems="center">
                <Icon
                  mb={1}
                  as={<MaterialCommunityIcons name={name} />}
                  size="lg"
                />

                <Text fontSize={12}>{route.title}</Text>
              </Center>
            </Pressable>
          );
        })}
      </HStack>
    </VStack>
  );
};
