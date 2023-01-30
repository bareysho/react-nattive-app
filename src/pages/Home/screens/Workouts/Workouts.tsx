import React, { FC, useState } from 'react';

import {
  Center,
  HStack,
  Pressable,
  ThemeType,
  useTheme,
  VStack,
} from '@src/components/UI';
import { ImageApp } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';
import {
  WORKOUT_PRIMARY_COLOR,
  WORKOUT_SECONDARY_COLOR,
  IMAGE_BY_WORKOUT_MAPPER,
} from '@src/constants/workouts';
import { IHomeTab } from '@src/pages/Home/Home';

import { WorkoutReady } from './WorkoutReady/WorkoutReady';

export const Workouts: FC<IHomeTab> = ({ navigate }) => {
  const [workOutType, setWorkoutType] = useState(WorkoutType.PushUp);

  const isActiveStyle = (itemWorkoutType: WorkoutType) =>
    itemWorkoutType === workOutType
      ? WORKOUT_PRIMARY_COLOR[workOutType]
      : WORKOUT_SECONDARY_COLOR[workOutType];

  const { theme } = useTheme();

  return (
    <VStack
      backgroundColor={theme.background}
      height="100%"
      width="100%"
      justifyContent="space-between"
      flex={1}
    >
      <HStack pb={2}>
        {Object.values(WorkoutType).map(workOutTypeName => (
          <Pressable
            width="33.33%"
            height={65}
            key={workOutTypeName}
            backgroundColor={isActiveStyle(workOutTypeName)}
            pressedBackgroundColor={isActiveStyle(workOutTypeName)}
            onPress={() => {
              setWorkoutType(workOutTypeName);
            }}
          >
            <Center
              width="100%"
              height="100%"
              alignItems="center"
              opacity={0.6}
            >
              <ImageApp
                themeType={ThemeType.Light}
                name={IMAGE_BY_WORKOUT_MAPPER[workOutTypeName]}
              />
            </Center>
          </Pressable>
        ))}
      </HStack>

      <WorkoutReady
        mainColor={WORKOUT_PRIMARY_COLOR[workOutType]}
        secondaryColor={WORKOUT_SECONDARY_COLOR[workOutType]}
        workoutType={workOutType}
        navigate={navigate}
      />
    </VStack>
  );
};
