import React, { FC, useEffect, useMemo } from 'react';
import { Box, Button, Center, HStack, Icon, Progress, Text } from 'native-base';
import { useTimer } from 'use-timer';
import { useColorModeValue } from 'native-base/src/core/color-mode/hooks';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  WorkoutState,
  finishSet,
  increaseReps,
  initWorkout,
  setWorkoutState,
  increaseSetNumber,
} from '@src/redux/slices/workoutSlice';
import { TimerType } from '@src/enums/timer';
import { WorkoutType } from '@src/enums/WorkoutType';
import { selectWorkout } from '@src/selectors/workout';
import { useAppDispatch, useAppSelector } from '@src/redux/store';

import { CircleButton } from './CircleButton';

interface IWorkout {
  mainColor: string;
  workoutType: WorkoutType;
}

export const Workout: FC<IWorkout> = ({
  mainColor: colorSchema,
  workoutType,
}) => {
  const dispatch = useAppDispatch();

  const workoutMainColor = `${colorSchema}.300`;

  const initialSetList = [20, 19, 15, 18];

  useEffect(() => {
    dispatch(initWorkout({ setList: initialSetList, setNumber: 0 }));
  }, [dispatch]);

  const { reps, repsDoneTotal, setNumber, workoutState, setList } =
    useAppSelector(selectWorkout(workoutType));

  const approachRepetitions = useMemo(
    () => setList[setNumber],
    [setList, setNumber],
  );

  const isSetDone = useMemo(
    () => approachRepetitions === reps,
    [approachRepetitions, reps],
  );

  const isLastSet = useMemo(
    () => setNumber === setList.length - 1,
    [setNumber, setList.length],
  );

  const { start, time, reset } = useTimer({
    timerType: TimerType.Decremental,
    endTime: 0,
    initialTime: 60,
    onTimeOver: () => {
      dispatch(setWorkoutState(WorkoutState.Working));
    },
  });

  useEffect(() => {
    if (isSetDone && !isLastSet) {
      dispatch(increaseSetNumber());
      dispatch(setWorkoutState(WorkoutState.Pause));
      start();
    }

    if (isSetDone && isLastSet) {
      dispatch(setWorkoutState(WorkoutState.Finished));
    }
  }, [dispatch, isSetDone, isLastSet]);

  useEffect(() => {
    if (workoutState === WorkoutState.Pause) {
      start();
    }
  }, [dispatch, workoutState]);

  const totalWorkoutReps = setList.reduce((accum, value) => accum + value, 0);

  const setBlockColor = useColorModeValue('trueGray.50', 'trueGray.800');
  const prevSetBlockColor = useColorModeValue('gray.300', 'gray.600');

  const buttonProps: Record<
    WorkoutState,
    { title: string; callback: () => void }
  > = {
    [WorkoutState.Ready]: {
      title: 'Начать заново',
      callback: () => {
        dispatch(initWorkout({ setList, setNumber: 0 }));
      },
    },
    [WorkoutState.Working]: {
      title: 'Закончил подход самостоятельно',
      callback: () => {
        dispatch(finishSet());
      },
    },
    [WorkoutState.Pause]: {
      title: 'Пропустить отдых',
      callback: () => {
        dispatch(setWorkoutState(WorkoutState.Working));
        reset();
      },
    },
    [WorkoutState.Finished]: {
      title: 'Начать заново',
      callback: () => {
        dispatch(initWorkout({ setList, setNumber: 0 }));
      },
    },
  };

  const { title, callback } = buttonProps[workoutState];

  const getSetBlockBackgroundColor = (approachItem: number) => {
    if (approachItem === setNumber) {
      return workoutMainColor;
    }

    if (approachItem < setNumber) {
      return prevSetBlockColor;
    }

    return setBlockColor;
  };

  return (
    <>
      <HStack py={4} height="12%" justifyContent="space-evenly">
        {setList.map((setListReps, index) => (
          <Center
            key={index}
            height={58}
            rounded={10}
            borderWidth={3}
            alignItems="center"
            borderColor="gray.200"
            shadow={1}
            backgroundColor={getSetBlockBackgroundColor(index)}
          >
            <Text px={4} textAlign="center" fontSize={16}>
              {setListReps}
            </Text>
          </Center>
        ))}
      </HStack>

      <Box height="4%">
        <Progress
          _filledTrack={{
            bg: workoutMainColor,
          }}
          width="95%"
          alignSelf="center"
          value={(repsDoneTotal / totalWorkoutReps) * 100}
        />
      </Box>

      <Box justifyContent="center" height="8%">
        <Text px={4} textAlign="left" fontSize={16}>
          <Text>Всего повторений: </Text>

          <Text fontWeight={600}>{totalWorkoutReps}</Text>
        </Text>

        <HStack px={4} textAlign="left" fontSize={16}>
          <Text>Всего повторений выполнено: </Text>

          <Text fontWeight={600}>{repsDoneTotal}</Text>
        </HStack>
      </Box>

      <Center
        height="56%"
        alignSelf="center"
        justifyContent="center"
        alignItems="center"
      >
        {workoutState !== WorkoutState.Finished && (
          <>
            {(workoutState === WorkoutState.Working ||
              workoutState === WorkoutState.Ready) && (
              <CircleButton
                shadow={1}
                text={approachRepetitions - reps}
                onPress={() => dispatch(increaseReps())}
                backgroundColor={workoutMainColor}
                pressedBackgroundColor={`${colorSchema}.400`}
              />
            )}

            {workoutState === WorkoutState.Pause && (
              <CircleButton
                text={time}
                withLoading
                loaderColor={workoutMainColor}
                pressedBackgroundColor="gray.300"
                backgroundColor="gray.300"
              />
            )}
          </>
        )}

        {workoutState === WorkoutState.Finished && (
          <Box>
            <Icon size={160} as={<FontAwesome5 name="flag-checkered" />} />
          </Box>
        )}
      </Center>

      <Center height="8%">
        <Button
          width="95%"
          backgroundColor={workoutMainColor}
          _pressed={{
            backgroundColor: `${colorSchema}.400`,
          }}
          onPress={callback}
        >
          {title}
        </Button>
      </Center>
    </>
  );
};
