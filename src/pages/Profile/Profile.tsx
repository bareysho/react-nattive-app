import React, { FC } from 'react';
import { Button, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { FullSpaceContainer } from '@src/components/FullSpaceContainer';
import { logout } from '@src/redux/slices/auth/asyncThunks/authAthunkThunks';

const styles = StyleSheet.create({
  button: {
    margin: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
});

export const Profile: FC<{ onLogoutNavigate: () => void }> = ({
  onLogoutNavigate,
}) => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectAuthState);

  return (
    <FullSpaceContainer>
      {user && (
        <>
          <Text>Authenticated User information</Text>

          <Text>{user.email}</Text>

          <Text>{user.id}</Text>

          <Text>{user.username}</Text>

          <Text>{user.role}</Text>

          <Text>{user.verified}</Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained-tonal"
              style={styles.button}
              onPress={async () => {
                await dispatch(logout());

                onLogoutNavigate();
              }}
            >
              Выйти
            </Button>
          </View>
        </>
      )}
    </FullSpaceContainer>
  );
};
