import React, { FC, useEffect, useMemo } from 'react';
import { useTimer } from 'use-timer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  finishSet,
  increaseReps,
  increaseSetNumber,
  initWorkout,
  setWorkoutState,
  WorkoutState,
} from '@src/redux/slices/workoutSlice';
import { TimerType } from '@src/enums/timer';
import { WorkoutType } from '@src/enums/WorkoutType';
import { selectWorkout } from '@src/selectors/workout';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { selectAuthState } from '@src/selectors/auth';
import {
  Box,
  HStack,
  Progress,
  Center,
  Text,
  Button,
  Icon,
} from '@src/components/UI';
import StorageContext from '@src/storage/storage';

import { CircleButton } from './CircleButton';

const { useRealm } = StorageContext;

interface IWorkout {
  mainColor: string;
  secondaryColor: string;
  workoutType: WorkoutType;
}

export const Workout: FC<IWorkout> = ({
  mainColor: colorSchema,
  secondaryColor,
  workoutType,
}) => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectAuthState);

  const realm = useRealm();

  const workoutMainColor = `${colorSchema}`;

  const initialSetList = [20, 19, 15, 18];

  const {
    time: durationTimeSec,
    start: startWorkoutTimer,
    pause: stopDurationTimer,
    reset: resetWorkoutTimer,
  } = useTimer({
    timerType: TimerType.Incremental,
  });

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

  const {
    time: pauseTime,
    start: startPause,
    reset: resetPause,
  } = useTimer({
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
      startPause();
    }

    if (isSetDone && isLastSet) {
      stopDurationTimer();
      dispatch(setWorkoutState(WorkoutState.Finished));
    }
  }, [dispatch, isSetDone, isLastSet]);

  useEffect(() => {
    if (workoutState === WorkoutState.Pause) {
      startPause();
    }
  }, [dispatch, workoutState]);

  const totalWorkoutReps = setList.reduce((accum, value) => accum + value, 0);

  // const setBlockColor = useColorModeValue('#fafafa', '#262626');
  // const prevSetBlockColor = useColorModeValue('#d4d4d8', '#52525b');

  const setBlockColor = '#fafafa';
  const prevSetBlockColor = '#d4d4d8';

  const finishWorkoutCallback = async () => {
    realm.write(() => {
      realm.create(
        'WorkoutEvent',
        WorkoutEvent.generate({
          userId: user.id,
          setList,
          workoutType,
          durationTimeSec,
        }),
      );
    });

    resetWorkoutTimer();
    dispatch(initWorkout({ setList, setNumber: 0 }));
  };

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
        resetPause();
      },
    },
    [WorkoutState.Finished]: {
      title: 'Начать заново',
      callback: finishWorkoutCallback,
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
    <Box px={4} width="100%" height="100%">
      <HStack py={4} width="100%" height="12%" justifyContent="space-between">
        {setList.map((setListReps, index) => (
          <Center
            shadow={1}
            key={index}
            height={60}
            rounded={10}
            borderWidth={3}
            borderColor="#d4d4d4"
            backgroundColor={getSetBlockBackgroundColor(index)}
          >
            <Text px={4}>{setListReps}</Text>
          </Center>
        ))}
      </HStack>

      <Box width="100%" alignItems="center" height="4%">
        <Progress
          width="100%"
          progressLineColor={workoutMainColor}
          value={(repsDoneTotal / totalWorkoutReps) * 100}
        />
      </Box>

      <Box height="8%">
        <Text px={4}>
          Длительность: <Text fontWeight={600}>{durationTimeSec}</Text>
        </Text>

        <Text px={4}>
          Всего повторений: <Text fontWeight={600}>{totalWorkoutReps}</Text>
        </Text>

        <Text px={4}>
          Повторений выполнено: <Text fontWeight={600}>{repsDoneTotal}</Text>
        </Text>
      </Box>

      <Center width="100%" height="56%">
        {workoutState !== WorkoutState.Finished && (
          <>
            {(workoutState === WorkoutState.Working ||
              workoutState === WorkoutState.Ready) && (
              <CircleButton
                shadow={1}
                text={approachRepetitions - reps}
                pressedBackgroundColor={secondaryColor}
                onPress={() => {
                  if (!durationTimeSec) {
                    startWorkoutTimer();
                  }

                  dispatch(increaseReps());
                }}
                backgroundColor={workoutMainColor}
              />
            )}

            {workoutState === WorkoutState.Pause && (
              <CircleButton
                withLoading
                text={pauseTime}
                loaderColor={workoutMainColor}
                pressedBackgroundColor="#d6d3d1"
                backgroundColor="#d6d3d1"
              />
            )}
          </>
        )}

        {workoutState === WorkoutState.Finished && (
          <Icon size={160} as={<FontAwesome5 name="flag-checkered" />} />
        )}
      </Center>

      <HStack
        width="100%"
        height="8%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          minWidth={300}
          backgroundColor={workoutMainColor}
          backgroundColorPressed={secondaryColor}
          onPress={callback}
        >
          {title}
        </Button>

        <Button
          backgroundColor={workoutMainColor}
          rightIcon={
            <MaterialCommunityIcons
              size={26}
              color="#57534e"
              name="arrow-up-drop-circle"
            />
          }
        />
      </HStack>
    </Box>
  );
};
