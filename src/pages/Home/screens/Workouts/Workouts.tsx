import React, { useState } from 'react';
import { Box, HStack, Pressable, VStack } from 'native-base';

import { ImageApp, ImageAppName } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';
import { Workout } from '@src/pages/Home/screens/Workouts/Workout/Workout';
import { useThemedBgColor } from '@src/hooks/useThemedBgColor';

export const Workouts = () => {
  const squatWorkoutColor = 'cyan';
  const pushUpWorkoutColor = 'primary';
  const sitUpWorkoutColor = 'green';

  const [workOutType, setWorkoutType] = useState(WorkoutType.PushUp);

  const contentMapper = {
    [WorkoutType.Squat]: squatWorkoutColor,
    [WorkoutType.PushUp]: pushUpWorkoutColor,
    [WorkoutType.SitUp]: sitUpWorkoutColor,
  };

  const isActiveStyle = (itemWorkoutType: WorkoutType) =>
    itemWorkoutType === workOutType ? 300 : 500;

  const bg = useThemedBgColor();

  return (
    <>
      <VStack bg={bg} height="100%" width="100%" justifyContent="space-between">
        <HStack height="12%" pb={2} justifyContent="space-evenly">
          <Pressable
            width="33.33%"
            alignItems="center"
            justifyContent="center"
            backgroundColor={`${contentMapper[workOutType]}.${isActiveStyle(
              WorkoutType.Squat,
            )}`}
            onPress={() => {
              setWorkoutType(WorkoutType.Squat);
            }}
          >
            <Box opacity={0.6}>
              <ImageApp name={ImageAppName.Squat} />
            </Box>
          </Pressable>

          <Pressable
            width="33.33%"
            alignItems="center"
            justifyContent="center"
            height="100%"
            backgroundColor={`${contentMapper[workOutType]}.${isActiveStyle(
              WorkoutType.PushUp,
            )}`}
            onPress={() => {
              setWorkoutType(WorkoutType.PushUp);
            }}
          >
            <Box opacity={0.6}>
              <ImageApp name={ImageAppName.PushUp} />
            </Box>
          </Pressable>

          <Pressable
            width="33.33%"
            alignItems="center"
            justifyContent="center"
            height="100%"
            backgroundColor={`${contentMapper[workOutType]}.${isActiveStyle(
              WorkoutType.SitUp,
            )}`}
            onPress={() => {
              setWorkoutType(WorkoutType.SitUp);
            }}
          >
            <Box opacity={0.6}>
              <ImageApp name={ImageAppName.SitUp} />
            </Box>
          </Pressable>
        </HStack>

        {workOutType === WorkoutType.PushUp && (
          <Workout
            workoutType={WorkoutType.PushUp}
            mainColor={pushUpWorkoutColor}
          />
        )}

        {workOutType === WorkoutType.Squat && (
          <Workout
            workoutType={WorkoutType.Squat}
            mainColor={squatWorkoutColor}
          />
        )}

        {workOutType === WorkoutType.SitUp && (
          <Workout
            workoutType={WorkoutType.SitUp}
            mainColor={sitUpWorkoutColor}
          />
        )}
      </VStack>
    </>
  );
};
