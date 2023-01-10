import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { recallUser } from '@src/redux/slices/auth/asyncThunks/authAthunkThunks';
import { getStorageUser, removeStorageUser } from '@src/utils/asyncStorage';
import { GlobalLoadingContext } from '@src/providers/GlobalLoadingProvider';
import { Navigation } from '@src/navigation/Navigation';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const App = () => {
  const theme = useTheme();

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
          await dispatch(recallUser(authenticatedUserId)).unwrap();
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
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ActivityIndicator size={40} />
    </View>
  ) : (
    <Navigation />
  );
};
