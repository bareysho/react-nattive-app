import React, { FC, useContext, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Button,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
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
  const [toggle, setToggle] = useState(false);

  return <Switch toggle={setToggle} value={toggle} />;
};

const ROLE_MAPPER = {
  user: 'Пользователь',
  admin: 'Администратор',
};

export const Profile: FC<IHomeTab> = ({ navigate }) => {
  const dispatch = useAppDispatch();

  const { setGlobalLoading } = useContext(GlobalLoadingContext);

  const { user, isLoading } = useAppSelector(selectAuthState);

  const handleLogout = async () => {
    await dispatch(logoutAction());

    setGlobalLoading(true);

    navigate('Login');
  };

  return (
    <PageLayout>
      <HStack width="100%" justifyContent="space-between" mb={6}>
        <Pressable>
          <Card>
            <Icon
              as={<Ionicons name={ICON_NAME_MAPPER_BY_COLOR_MODE.light} />}
              size={20}
            />
          </Card>
        </Pressable>

        <ExitModal
          handleLogout={handleLogout}
          renderComponent={toggleOpen => (
            <Pressable onPress={toggleOpen}>
              <Card width="auto">
                <Icon as={<Ionicons name="exit-outline" />} size={20} />
              </Card>
            </Pressable>
          )}
        />
      </HStack>

      <Card flexDirection="row" mb={10}>
        <Icon mr={10} size={120} as={<MaterialIcons name="account-circle" />} />

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

      <Card mb={20}>
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
          callback={() => {
            console.log('changed theme');
          }}
        />
      </Card>

      <ExitModal
        handleLogout={handleLogout}
        isLoading={isLoading}
        renderComponent={toggleOpen => (
          <Button width="100%" onPress={toggleOpen}>
            Выйти
          </Button>
        )}
      />
    </PageLayout>
  );
};
