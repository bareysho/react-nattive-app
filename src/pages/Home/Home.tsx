import React, { FC } from 'react';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  useTheme,
  VStack,
} from '@src/components/UI';

import { Dashboard, History, Profile, Statistics, Workouts } from './screens';

export interface IHomeTab {
  navigate: (path: string) => void;
}

interface IRoutesConfig {
  key: string;
  title: string;
  focusedIcon: string;
  content: FC<IHomeTab>;
}

const ROUTES: IRoutesConfig[] = [
  {
    key: 'application',
    title: 'Сводка',
    focusedIcon: 'application-outline',
    content: Dashboard,
  },
  {
    key: 'arm-flex',
    title: 'Тренировка',
    focusedIcon: 'arm-flex-outline',
    content: Workouts,
  },
  {
    key: 'chart-box',
    title: 'Статистика',
    focusedIcon: 'chart-box-outline',
    content: Statistics,
  },
  {
    key: 'history',
    title: 'История',
    focusedIcon: 'history',
    content: History,
  },
  {
    key: 'account',
    title: 'Профиль',
    focusedIcon: 'account-outline',
    content: Profile,
  },
];

export const Home: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const Component = ROUTES[selectedTab].content;

  const { theme } = useTheme();

  return (
    <VStack width="100%" justifyContent="space-between" flex={1}>
      <Box alignItems="center" alignSelf="center" width="100%" height="92%">
        <Component navigate={navigation.navigate} />
      </Box>

      <HStack
        height="8%"
        width="100%"
        zIndex={3}
        justifyContent="space-between"
        alignItems="center"
        shadow={0.2}
        backgroundColor={theme.cardBackground}
      >
        {ROUTES.map((route, index) => {
          const isActive = selectedTab === index;

          const opacity = isActive ? 1 : 0.6;
          const name = isActive ? route.key : route.focusedIcon;

          const handleSelect = () => setSelectedTab(index);

          return (
            <Pressable
              key={route.key}
              opacity={opacity}
              py={3}
              flex={1}
              alignItems="center"
              rounded={10}
              onPress={handleSelect}
            >
              <Icon mb={1} as={<MaterialCommunityIcons name={name} />} />

              <Text fontSize={12}>{route.title}</Text>
            </Pressable>
          );
        })}
      </HStack>
    </VStack>
  );
};
