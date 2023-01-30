import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Center, Fab, Icon, Spinner, useTheme } from '@src/components/UI';
import { useAppDispatch } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { recallUserAction } from '@src/redux/actions/authActions';
import { Navigation } from '@src/navigation/Navigation';
import { GlobalLoadingContext } from '@src/providers/GlobalLoadingProvider';
import { ICON_NAME_MAPPER_BY_COLOR_MODE } from '@src/constants/common';
import { ACCESS_TOKEN_KEY, USER_ID_KEY } from '@src/constants/asyncStorage';
import { setAccessToken } from '@src/redux/slices/authenticationSlice';
import { setWorkoutLevel } from '@src/redux/slices/workoutSlice';
import { WorkoutType } from '@src/enums/WorkoutType';
import { WORKOUT_LEVEL_ASYNC_STORAGE_KEY } from '@src/constants/workouts';

export const App = () => {
  const dispatch = useAppDispatch();

  const { isGlobalLoading, setGlobalLoading } =
    useContext(GlobalLoadingContext);

  const { themeType, switchTheme } = useTheme();

  const { isAuthenticated, user: authenticatedUser } =
    useSelector(selectAuthState);

  const [isUserRecalled, setUserRecalled] = useState(false);

  useEffect(() => {
    (async () => {
      const authenticatedUserId = await AsyncStorage.getItem(USER_ID_KEY);
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

      if (!accessToken || !authenticatedUserId) {
        setUserRecalled(true);
        setGlobalLoading(false);
      }

      if (accessToken) {
        await dispatch(setAccessToken(accessToken));

        const workoutTypes = Object.values(WorkoutType);

        const workoutStoredLevels = await AsyncStorage.multiGet(
          workoutTypes.map(value => WORKOUT_LEVEL_ASYNC_STORAGE_KEY[value]),
        );

        for (const [index, workoutType] of workoutTypes.entries()) {
          const [workoutLevel = 0] = workoutStoredLevels[index].reverse();

          dispatch(
            setWorkoutLevel({
              workoutType,
              level: Number(workoutLevel),
            }),
          );
        }
      }

      if (!authenticatedUser.id && authenticatedUserId) {
        setGlobalLoading(true);

        try {
          await dispatch(
            recallUserAction({ userId: authenticatedUserId }),
          ).unwrap();
        } catch (error) {
          console.log(error);
        }
      }

      setUserRecalled(true);
      setGlobalLoading(false);
    })();
  }, [dispatch, authenticatedUser.id]);

  const isApplicationLoading = isGlobalLoading || !isUserRecalled;

  // const { colorMode, toggleColorMode } = useColorMode();

  return isApplicationLoading ? (
    <Center alignItems="center" flex={1}>
      <Spinner size={60} />
    </Center>
  ) : (
    <>
      <Navigation />

      {!isAuthenticated && (
        <Fab
          shadow={2}
          size={50}
          onPress={() => switchTheme()}
          icon={
            <Icon
              color="black"
              as={<Ionicons name={ICON_NAME_MAPPER_BY_COLOR_MODE[themeType]} />}
              size={20}
            />
          }
        />
      )}
    </>
  );
};
