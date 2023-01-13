import React, { FC, ReactElement, useMemo } from 'react';
import { ParamListBase } from '@react-navigation/native';
import { Center, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Profile } from '../Profile';
import { Main } from '../Main';
import { Settings } from '../Settings';

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
        title: 'Home',
        focusedIcon: 'home-outline',
        content: <Main />,
      },
      {
        key: 'cog',
        title: 'Setting',
        focusedIcon: 'cog-outline',
        content: <Settings />,
      },
      {
        key: 'account',
        title: 'Profile',
        focusedIcon: 'account-outline',
        content: (
          <Profile
            onLogoutNavigate={() => {
              navigation.navigate('Login');
            }}
          />
        ),
      },
    ],
    [],
  );

  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <VStack justifyContent="space-between" flex={1}>
      <Center alignItems="center" flex={1}>
        {routes[selectedTab].content}
      </Center>

      <HStack bg="white" alignItems="center" safeAreaBottom shadow={6}>
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
