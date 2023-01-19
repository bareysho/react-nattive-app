import React, { FC, ReactElement, useMemo } from 'react';
import { ParamListBase } from '@react-navigation/native';
import { Center, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { PageLayout } from '@src/components/PageLayout';
import { useThemedBgColor } from '@src/hooks/useThemedBgColor';

import { Main, Profile, Settings } from './screens';

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
        key: 'home',
        title: 'Дом',
        focusedIcon: 'home-outline',
        content: <Main />,
      },
      {
        key: 'cog',
        title: 'Настройки',
        focusedIcon: 'cog-outline',
        content: <Settings />,
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
      <PageLayout>
        <Center>{routes[selectedTab].content}</Center>
      </PageLayout>

      <HStack bg={bg} alignItems="center" safeAreaBottom shadow={6}>
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
