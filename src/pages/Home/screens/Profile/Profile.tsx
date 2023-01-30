import React, { FC, useContext, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Box,
  Button,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  ThemeType,
  useTheme,
  VStack,
} from '@src/components/UI';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { logoutAction } from '@src/redux/actions/authActions';
import { MenuItem } from '@src/components/MenuItem';
import { ExitModal } from '@src/components/ExitModal';
import { ICON_NAME_MAPPER_BY_COLOR_MODE } from '@src/constants/common';
import { GlobalLoadingContext } from '@src/providers/GlobalLoadingProvider';
import { PageLayout } from '@src/components/PageLayout';
import { Card } from '@src/components/Card';
import { IHomeTab } from '@src/pages/Home/Home';

export const SwitchTheme = () => {
  const { switchTheme, themeType } = useTheme();

  return (
    <Switch toggle={() => switchTheme()} value={themeType === ThemeType.Dark} />
  );
};

const ROLE_MAPPER = {
  user: 'Пользователь',
  admin: 'Администратор',
};

export const Profile: FC<IHomeTab> = ({ navigate }) => {
  const dispatch = useAppDispatch();

  const { switchTheme, themeType } = useTheme();

  const { setGlobalLoading } = useContext(GlobalLoadingContext);

  const { user, isLoading } = useAppSelector(selectAuthState);

  const handleLogout = async () => {
    await dispatch(logoutAction());

    setGlobalLoading(true);

    navigate('Login');
  };

  return (
    <PageLayout>
      <VStack height="100%" width="100%" justifyContent="space-between">
        <VStack width="100%">
          <HStack width="100%" justifyContent="space-between" mb={5}>
            <Card onPress={() => switchTheme()} width="auto">
              <Icon
                as={
                  <Ionicons name={ICON_NAME_MAPPER_BY_COLOR_MODE[themeType]} />
                }
                size={20}
              />
            </Card>

            <ExitModal
              handleLogout={handleLogout}
              renderComponent={toggleOpen => (
                <Card width="auto" onPress={toggleOpen}>
                  <Icon as={<Ionicons name="exit-outline" />} size={20} />
                </Card>
              )}
            />
          </HStack>

          <Card flexDirection="row" mb={5}>
            <Icon
              mr={10}
              size={120}
              as={<MaterialIcons name="account-circle" />}
            />

            <VStack>
              <Text mb={2} fontWeight={600}>
                Пользователь:
              </Text>

              <Text fontSize={14}>{user.username}</Text>

              <Text fontSize={14}>{user.email}</Text>

              <Text fontSize={14}>
                {user.verified ? 'Верифицирован' : 'Не верифицирован'}
              </Text>

              <Text fontSize={14}>{ROLE_MAPPER[user.role]}</Text>
            </VStack>
          </Card>

          <Card>
            <MenuItem
              title="Пароль"
              icon={<MaterialIcons name="vpn-key" />}
              callback={() => navigate('ChangePassword')}
            />

            <MenuItem
              title="Email"
              icon={<MaterialIcons name="email" />}
              callback={() => navigate('ChangeEmail')}
            />

            <MenuItem
              title="Темная тема"
              icon={<Ionicons name="ios-sunny-sharp" />}
              rightIcon={<SwitchTheme />}
              callback={() => switchTheme()}
            />
          </Card>
        </VStack>

        <ExitModal
          handleLogout={handleLogout}
          isLoading={isLoading}
          renderComponent={toggleOpen => (
            <Button width="100%" onPress={toggleOpen}>
              Выйти
            </Button>
          )}
        />
      </VStack>
    </PageLayout>
  );
};
