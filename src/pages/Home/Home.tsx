import React, { FC } from 'react';
import { Easing, StyleSheet, View } from 'react-native';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack/src/types';
import { ParamListBase } from '@react-navigation/native';

import { Profile } from '../Profile';
import { Main } from '../Main';
import { Settings } from '../Settings';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  button: {
    margin: 4,
  },
});

type RoutesState = Array<{
  key: string;
  title: string;
  focusedIcon: string;
  badge?: boolean;
}>;

const SCENE_ANIMATION = 'shifting';

export const Home: FC<StackScreenProps<ParamListBase>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState<RoutesState>([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
    },
    {
      key: 'settings',
      title: 'Setting',
      focusedIcon: 'cog',
      badge: true,
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account',
    },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.Content title="Главная" />
      </Appbar.Header>

      <BottomNavigation
        safeAreaInsets={{ bottom: insets.bottom }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        labelMaxFontSizeMultiplier={2}
        /* eslint-disable-next-line new-cap */
        renderScene={BottomNavigation.SceneMap({
          home: () => <Main />,
          settings: () => <Settings />,
          profile: () => (
            <Profile onLogoutNavigate={() => navigation.navigate('Login')} />
          ),
        })}
        sceneAnimationEnabled
        sceneAnimationType={SCENE_ANIMATION}
        sceneAnimationEasing={Easing.ease}
      />
    </View>
  );
};
