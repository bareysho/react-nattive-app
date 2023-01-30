import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { selectAuthState } from '@src/selectors/auth';
import { ForgetPassword, Home, Login, Registration } from '@src/pages';
import { ChangeEmail, ChangePassword } from '@src/pages/Home/screens';
import { ApplicationBar } from '@src/components/ApplicationBar';
import {
  PushUpsScreen,
  SitUpsScreen,
  SquatsScreen,
} from '@src/pages/Home/screens/Workouts/Workout/Workout';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { user: authenticatedUser, isAuthenticated } =
    useSelector(selectAuthState);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authenticatedUser.id && isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              options={{
                title: 'Главная',
                headerShown: false,
              }}
              component={Home}
            />

            <Stack.Screen
              name="SitUpWorkoutScreen"
              options={{
                headerShown: false,
              }}
              component={SitUpsScreen}
            />

            <Stack.Screen
              name="PushUpsWorkoutScreen"
              options={{
                headerShown: false,
              }}
              component={PushUpsScreen}
            />

            <Stack.Screen
              name="SquatWorkoutScreen"
              options={{
                headerShown: false,
              }}
              component={SquatsScreen}
            />

            <Stack.Screen
              name="ChangePassword"
              options={{
                title: 'Изменение пароля',
                headerShown: true,
                header: ApplicationBar,
              }}
              component={ChangePassword}
            />

            <Stack.Screen
              name="ChangeEmail"
              options={{
                title: 'Изменение email',
                headerShown: true,
                header: ApplicationBar,
              }}
              component={ChangeEmail}
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
                headerShown: false,
              }}
              component={Registration}
            />

            <Stack.Screen
              name="ForgetPassword"
              options={{
                title: 'Восстановление пароля',
                headerShown: false,
              }}
              component={ForgetPassword}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
