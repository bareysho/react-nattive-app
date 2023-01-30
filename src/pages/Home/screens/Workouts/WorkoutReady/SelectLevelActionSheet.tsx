import React, { FC, Fragment, RefObject, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionSheetRef } from 'react-native-actions-sheet';

import {
  ActionSheet,
  Box,
  Pressable,
  Text,
  useTheme,
} from '@src/components/UI';
import {
  PUSH_UP_WORKOUT_LEVELS,
  WORKOUT_LEVEL_ASYNC_STORAGE_KEY,
} from '@src/constants/workouts';
import { setWorkoutLevel } from '@src/redux/slices/workoutSlice';
import { LIGHT_PRIMARY_COLORS } from '@src/components/UI/components/ThemeProvider/lightPrimary';
import { WorkoutType } from '@src/enums/WorkoutType';
import { useAppDispatch } from '@src/redux/store';

interface ISelectLevelActionSheet {
  actionSheetRef: RefObject<ActionSheetRef>;
  workoutType: WorkoutType;
  workoutLevel: number;
}

export const SelectLevelActionSheet: FC<ISelectLevelActionSheet> = ({
  actionSheetRef,
  workoutType,
  workoutLevel,
}) => {
  const dispatch = useAppDispatch();

  const { theme } = useTheme();

  const handleSelectLevel = useCallback(
    (level: string) => async () => {
      await AsyncStorage.setItem(
        WORKOUT_LEVEL_ASYNC_STORAGE_KEY[workoutType],
        level,
      );

      dispatch(
        setWorkoutLevel({
          workoutType,
          level: Number(level),
        }),
      );

      actionSheetRef.current?.hide();
    },
    [workoutType],
  );

  const workoutConfigsGroupByLevel = Object.entries(PUSH_UP_WORKOUT_LEVELS);

  return (
    <ActionSheet actionSheetRef={actionSheetRef}>
      {workoutConfigsGroupByLevel.map(([configLevel, workoutConfig], index) => {
        const isSelectedLevel = workoutLevel === Number(configLevel);

        const textColor =
          (isSelectedLevel && LIGHT_PRIMARY_COLORS.text) || undefined;

        const backgroundColor = (isSelectedLevel && theme.primary) || undefined;

        const { restSec, set: setList } = workoutConfig;

        return (
          <Fragment key={index}>
            <Pressable
              rounded={5}
              width="100%"
              backgroundColor={backgroundColor}
              onPress={handleSelectLevel(configLevel)}
            >
              <Text rounded={5} p={2} color={textColor}>
                {`${configLevel}. ${setList.join(' - ')}, отдых ${restSec}`}
              </Text>
            </Pressable>

            {index !== workoutConfigsGroupByLevel.length - 1 && (
              <Box
                my={1}
                width="100%"
                borderBottomWidth={1}
                borderColor={theme.text}
              />
            )}
          </Fragment>
        );
      })}
    </ActionSheet>
  );
};
