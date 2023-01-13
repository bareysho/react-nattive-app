import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Center, Spinner } from 'native-base';

import { useAppDispatch } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { recallUserAction } from '@src/redux/actions/authActions';
import { getStorageUser, removeStorageUser } from '@src/utils/asyncStorage';
import { Navigation } from '@src/navigation/Navigation';
import { GlobalLoadingContext } from '@src/providers/GlobalLoadingProvider';

export const App = () => {
  const dispatch = useAppDispatch();

  const { isGlobalLoading, setGlobalLoading } =
    useContext(GlobalLoadingContext);

  const { user: authenticatedUser } = useSelector(selectAuthState);

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

  return isApplicationLoading ? (
    <Center alignItems="center" flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <Navigation />
  );
};
