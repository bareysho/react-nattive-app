import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Center, Fab, Icon, Spinner, useColorMode } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppDispatch } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { recallUserAction } from '@src/redux/actions/authActions';
import { getStorageUser, removeStorageUser } from '@src/utils/asyncStorage';
import { Navigation } from '@src/navigation/Navigation';
import { GlobalLoadingContext } from '@src/providers/GlobalLoadingProvider';
import { ICON_NAME_MAPPER_BY_COLOR_MODE } from '@src/constants/common';

export const App = () => {
  const dispatch = useAppDispatch();

  const { isGlobalLoading, setGlobalLoading } =
    useContext(GlobalLoadingContext);

  const { isAuthenticated, user: authenticatedUser } =
    useSelector(selectAuthState);

  const [isUserRecalled, setUserRecalled] = useState(false);

  useEffect(() => {
    (async () => {
      const { id: authenticatedUserId } = await getStorageUser();

      if (!authenticatedUser && authenticatedUserId) {
        setGlobalLoading(true);

        try {
          await dispatch(
            recallUserAction({ userId: authenticatedUserId }),
          ).unwrap();
        } catch (error) {
          await removeStorageUser();
        }

        setGlobalLoading(false);
      }

      setUserRecalled(true);
    })();
  }, [dispatch, authenticatedUser]);

  const isApplicationLoading = isGlobalLoading || !isUserRecalled;

  const { colorMode, toggleColorMode } = useColorMode();

  return isApplicationLoading ? (
    <Center alignItems="center" flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <>
      <Navigation />

      {!isAuthenticated && (
        <Fab
          renderInPortal={false}
          shadow={2}
          placement="bottom-right"
          size="sm"
          onPress={toggleColorMode}
          icon={
            <Icon
              color="black"
              as={Ionicons}
              name={ICON_NAME_MAPPER_BY_COLOR_MODE[colorMode || 'light']}
              size="4"
            />
          }
        />
      )}
    </>
  );
};
