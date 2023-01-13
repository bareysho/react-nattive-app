import React, { FC } from 'react';
import { Button, Center, Text } from 'native-base';

import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { logoutAction } from '@src/redux/actions/authActions';

interface IProfile {
  onLogoutNavigate: () => void;
}

export const Profile: FC<IProfile> = ({ onLogoutNavigate }) => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectAuthState);

  const handleLogout = async () => {
    await dispatch(logoutAction());

    onLogoutNavigate();
  };

  return (
    <>
      {user && (
        <Center>
          <Text fontWeight={600}>Authenticated user information:</Text>

          <Text>{user.email}</Text>

          <Text>{user.id}</Text>

          <Text>{user.username}</Text>

          <Text>{user.role}</Text>

          <Text>{user.verified}</Text>

          <Button px={10} onPress={handleLogout}>
            Выйти
          </Button>
        </Center>
      )}
    </>
  );
};
