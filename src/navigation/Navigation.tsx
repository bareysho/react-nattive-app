import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { selectAuthState } from '@src/selectors/auth';
import { ForgetPassword, Home, Login, Registration } from '@src/pages';
import { ChangeEmail, ChangePassword } from '@src/pages/Home/screens';

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { user: authenticatedUser, isAuthenticated } =
    useSelector(selectAuthState);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authenticatedUser && isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              options={{
                title: 'Главная',
                headerShown: false,
                // header: props => <ApplicationBar {...props} />,
              }}
              component={Home}
            />

            <Stack.Screen
              name="ChangePassword"
              options={{
                title: 'Изменение пароля',
                headerShown: true,
                // header: props => <ApplicationBar {...props} />,
              }}
              component={ChangePassword}
            />

            <Stack.Screen
              name="ChangeEmail"
              options={{
                title: 'Изменение email',
                headerShown: true,
                // header: props => <ApplicationBar {...props} />,
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
