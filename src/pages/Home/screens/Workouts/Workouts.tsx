import React, { useState } from 'react';

import {
  HStack,
  VStack,
  Pressable,
  Center,
  useTheme,
} from '@src/components/UI';
import { ImageApp, ImageAppName } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';
import { Workout } from '@src/pages/Home/screens/Workouts/Workout/Workout';

export const Workouts = () => {
  const squatWorkoutColor = '#67e8f9';
  const pushUpWorkoutColor = '#ffe502';
  const sitUpWorkoutColor = '#86efac';

  const [workOutType, setWorkoutType] = useState(WorkoutType.PushUp);

  const contentMapper = {
    [WorkoutType.Squat]: squatWorkoutColor,
    [WorkoutType.PushUp]: pushUpWorkoutColor,
    [WorkoutType.SitUp]: sitUpWorkoutColor,
  };

  const pressedContentMapper = {
    [WorkoutType.Squat]: '#0bd5e8',
    [WorkoutType.PushUp]: '#dcc40c',
    [WorkoutType.SitUp]: '#18c055',
  };

  const isActiveStyle = (itemWorkoutType: WorkoutType) =>
    itemWorkoutType === workOutType
      ? pressedContentMapper[workOutType]
      : contentMapper[workOutType];

  const { theme } = useTheme();

  return (
    <VStack
      backgroundColor={theme.background}
      height="100%"
      width="100%"
      justifyContent="space-between"
    >
      <HStack height="10%" pb={2}>
        <Pressable
          width="33.33%"
          height="100%"
          backgroundColor={isActiveStyle(WorkoutType.Squat)}
          pressedBackgroundColor={isActiveStyle(WorkoutType.Squat)}
          onPress={() => {
            setWorkoutType(WorkoutType.Squat);
          }}
        >
          <Center width="100%" height="100%" opacity={0.6}>
            <ImageApp name={ImageAppName.Squat} />
          </Center>
        </Pressable>

        <Pressable
          width="33.33%"
          height="100%"
          backgroundColor={isActiveStyle(WorkoutType.PushUp)}
          pressedBackgroundColor={isActiveStyle(WorkoutType.PushUp)}
          onPress={() => {
            setWorkoutType(WorkoutType.PushUp);
          }}
        >
          <Center width="100%" height="100%" opacity={0.6}>
            <ImageApp name={ImageAppName.PushUp} />
          </Center>
        </Pressable>

        <Pressable
          width="33.33%"
          height="100%"
          backgroundColor={isActiveStyle(WorkoutType.SitUp)}
          pressedBackgroundColor={isActiveStyle(WorkoutType.SitUp)}
          onPress={() => {
            setWorkoutType(WorkoutType.SitUp);
          }}
        >
          <Center width="100%" height="100%" opacity={0.6}>
            <ImageApp name={ImageAppName.SitUp} />
          </Center>
        </Pressable>
      </HStack>

      {workOutType === WorkoutType.PushUp && (
        <Workout
          workoutType={WorkoutType.PushUp}
          mainColor={pushUpWorkoutColor}
          secondaryColor={pressedContentMapper[WorkoutType.PushUp]}
        />
      )}

      {workOutType === WorkoutType.Squat && (
        <Workout
          workoutType={WorkoutType.Squat}
          mainColor={squatWorkoutColor}
          secondaryColor={pressedContentMapper[WorkoutType.Squat]}
        />
      )}

      {workOutType === WorkoutType.SitUp && (
        <Workout
          workoutType={WorkoutType.SitUp}
          mainColor={sitUpWorkoutColor}
          secondaryColor={pressedContentMapper[WorkoutType.SitUp]}
        />
      )}
    </VStack>
  );
};
