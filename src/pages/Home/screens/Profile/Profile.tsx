import React, { FC, useContext } from 'react';
import {
  Button,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  useColorMode,
  VStack,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { logoutAction } from '@src/redux/actions/authActions';
import { MenuItem } from '@src/components/MenuItem';
import { ExitModal } from '@src/components/ExitModal';
import { ICON_NAME_MAPPER_BY_COLOR_MODE } from '@src/constants/common';
import { GlobalLoadingContext } from '@src/providers/GlobalLoadingProvider';
import { PageLayout } from '@src/components/PageLayout';
import { Card } from '@src/components/Card';

interface IProfile {
  navigate: (path: string) => void;
}

export const SwitchTheme = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Switch
      onToggle={toggleColorMode}
      value={colorMode === 'dark'}
      colorScheme="primary"
    />
  );
};

const ROLE_MAPPER = {
  user: 'Пользователь',
  admin: 'Администратор',
};

export const Profile: FC<IProfile> = ({ navigate }) => {
  const dispatch = useAppDispatch();

  const { setGlobalLoading } = useContext(GlobalLoadingContext);

  const { user, isLoading } = useAppSelector(selectAuthState);

  const handleLogout = async () => {
    await dispatch(logoutAction());

    setGlobalLoading(true);

    navigate('Login');
  };

  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <PageLayout>
      {user && (
        <VStack w="100%">
          <HStack mb={6} justifyContent="space-between">
            <Pressable onPress={toggleColorMode}>
              <Card>
                <Icon
                  as={Ionicons}
                  name={ICON_NAME_MAPPER_BY_COLOR_MODE[colorMode || 'light']}
                  size="lg"
                />
              </Card>
            </Pressable>

            <ExitModal
              handleLogout={handleLogout}
              renderComponent={() => (
                <Card>
                  <Icon as={Ionicons} name="exit-outline" size="lg" />
                </Card>
              )}
            />
          </HStack>

          <Card mb={10}>
            <HStack>
              <Icon
                mr={10}
                size={120}
                as={<MaterialIcons name="account-circle" />}
              />

              <VStack mb={0}>
                <Text mb={2} fontSize={16} fontWeight={600}>
                  Пользователь:
                </Text>

                <Text>{user.username}</Text>

                <Text>{user.email}</Text>

                <Text>
                  {user.verified ? 'Верифицирован' : 'Не верифицирован'}
                </Text>

                <Text>{ROLE_MAPPER[user.role]}</Text>
              </VStack>
            </HStack>
          </Card>

          <Card mb={20}>
            <VStack>
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
                callback={toggleColorMode}
              />
            </VStack>
          </Card>

          <ExitModal
            handleLogout={handleLogout}
            isLoading={isLoading}
            renderComponent={toggleOpen => (
              <Button width="100%" onPress={toggleOpen} px={10}>
                Выйти
              </Button>
            )}
          />
        </VStack>
      )}
    </PageLayout>
  );
};
