import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

import { selectAuthState } from '@src/selectors/auth';
import { ForgetPassword, Home, Login, Registration } from '@src/pages';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const theme = useTheme();

  const { user: authenticatedUser } = useSelector(selectAuthState);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: [
            {
              backgroundColor: theme.colors.background,
            },
          ],
        }}
      >
        {authenticatedUser ? (
          <>
            <Stack.Screen
              name="Home"
              options={{ title: 'Главная' }}
              component={Home}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ title: 'Вход', headerShown: false }}
              component={Login}
            />

            <Stack.Screen
              name="Registration"
              options={{
                title: 'Регистрация',
                headerTintColor: theme.colors.onBackground,
                headerStyle: {
                  backgroundColor: theme.colors.elevation.level2,
                },
              }}
              component={Registration}
            />

            <Stack.Screen
              name="ForgetPassword"
              options={{
                title: 'Восстановление пароля',
                headerTintColor: theme.colors.onBackground,
                headerStyle: {
                  backgroundColor: theme.colors.elevation.level2,
                },
              }}
              component={ForgetPassword}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
