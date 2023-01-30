import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useTimer } from 'use-timer';
import { ActionSheetRef } from 'react-native-actions-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  ActionSheet,
  Button,
  Center,
  HStack,
  Icon,
  Progress,
  Text,
  useTheme,
  VStack,
} from '@src/components/UI';
import StorageContext from '@src/storage/storage';
import { LIGHT_PRIMARY_COLORS } from '@src/components/UI/components/ThemeProvider/lightPrimary';
import { Card } from '@src/components/Card';
import {
  PUSH_UP_WORKOUT_LEVELS,
  WORKOUT_PRIMARY_COLOR,
  WORKOUT_SECONDARY_COLOR,
} from '@src/constants/workouts';
import { PageLayout } from '@src/components/PageLayout';
import { DateService } from '@src/services/dateService';

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

  const {
    time: durationTimeSec,
    start: startWorkoutTimer,
    pause: stopDurationTimer,
    reset: resetWorkoutTimer,
  } = useTimer({
    timerType: TimerType.Incremental,
  });

  const { workoutLevel } = useAppSelector(selectWorkout(workoutType));

  const { set: initialSetList, restSec } = PUSH_UP_WORKOUT_LEVELS[workoutLevel];

  useEffect(() => {
    dispatch(
      initWorkout({
        setList: initialSetList,
        setNumber: 0,
        workoutType,
      }),
    );

    startWorkoutTimer();
  }, [dispatch, initialSetList, workoutType]);

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
    initialTime: restSec,
    onTimeOver: () => {
      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Working, workoutType }),
      );
    },
  });

  useEffect(() => {
    if (isSetDone && !isLastSet) {
      dispatch(increaseSetNumber({ workoutType }));
      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Pause, workoutType }),
      );
      startPause();
    }

    if (isSetDone && isLastSet) {
      stopDurationTimer();
      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Finished, workoutType }),
      );
    }
  }, [dispatch, isSetDone, isLastSet]);

  useEffect(() => {
    if (workoutState === WorkoutState.Pause) {
      startPause();
    }
  }, [dispatch, workoutState]);

  const totalWorkoutReps = setList.reduce((accum, value) => accum + value, 0);

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
    dispatch(initWorkout({ setList, setNumber: 0, workoutType }));
  };

  const buttonProps: Record<
    WorkoutState,
    { title: string; callback: () => void }
  > = {
    [WorkoutState.Ready]: {
      title: 'Начать заново',
      callback: () => {
        dispatch(initWorkout({ setList, setNumber: 0, workoutType }));
      },
    },
    [WorkoutState.Working]: {
      title: 'Закончил подход самостоятельно',
      callback: () => {
        dispatch(finishSet({ workoutType }));
      },
    },
    [WorkoutState.Pause]: {
      title: 'Пропустить отдых',
      callback: () => {
        dispatch(
          setWorkoutState({ workoutState: WorkoutState.Working, workoutType }),
        );
        resetPause();
      },
    },
    [WorkoutState.Finished]: {
      title: 'Начать заново',
      callback: finishWorkoutCallback,
    },
  };

  const { title, callback } = buttonProps[workoutState];

  const { theme } = useTheme();

  const getSetBlockBackgroundColor = (approachItem: number) => {
    if (approachItem === setNumber) {
      return workoutMainColor;
    }

    if (approachItem < setNumber) {
      return theme.disabledText;
    }

    return theme.cardBackground;
  };

  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    return () => actionSheetRef?.current?.hide();
  }, []);

  return (
    <PageLayout>
      <VStack
        flex={1}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <VStack width="100%">
          <HStack py={4} mb={5} width="100%" justifyContent="space-between">
            {setList.map((setListReps, index) => (
              <Card
                width="auto"
                shadow={1}
                key={index}
                rounded={10}
                borderWidth={3}
                justifyContent="center"
                borderColor="#d4d4d4"
                backgroundColor={getSetBlockBackgroundColor(index)}
              >
                <Text
                  fontSize={20}
                  color={
                    (index === setNumber && LIGHT_PRIMARY_COLORS.text) ||
                    undefined
                  }
                >
                  {setListReps}
                </Text>
              </Card>
            ))}
          </HStack>

          <Progress
            width="100%"
            mb={8}
            progressLineColor={workoutMainColor}
            value={(repsDoneTotal / totalWorkoutReps) * 100}
          />

          <Text>
            Длительность:{' '}

            <Text fontWeight={600}>
              {DateService.secondsToDurationString(durationTimeSec)}
            </Text>
          </Text>

          <Text>
            Всего повторений: <Text fontWeight={600}>{totalWorkoutReps}</Text>
          </Text>

          <Text>
            Повторений выполнено: <Text fontWeight={600}>{repsDoneTotal}</Text>
          </Text>
        </VStack>

        <Center width="100%">
          {workoutState !== WorkoutState.Finished && (
            <>
              {(workoutState === WorkoutState.Working ||
                workoutState === WorkoutState.Ready) && (
                <CircleButton
                  shadow={1}
                  text={approachRepetitions - reps}
                  backgroundColor={workoutMainColor}
                  pressedBackgroundColor={secondaryColor}
                  onPress={() => dispatch(increaseReps({ workoutType }))}
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

        <ActionSheet actionSheetRef={actionSheetRef}>
          <Button mb={3} width="100%">
            Пропустить подход
          </Button>

          <Button mb={3} width="100%">
            Закончить тренировку
          </Button>
        </ActionSheet>

        <HStack
          mb={4}
          width="100%"
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
            py={1}
            backgroundColor={workoutMainColor}
            onPress={() => actionSheetRef?.current?.show()}
            rightIcon={
              <MaterialCommunityIcons
                size={26}
                color="#57534e"
                name="arrow-up-drop-circle"
              />
            }
          />
        </HStack>
      </VStack>
    </PageLayout>
  );
};

export const SitUpsScreen = () => (
  <Workout
    mainColor={WORKOUT_PRIMARY_COLOR[WorkoutType.SitUp]}
    secondaryColor={WORKOUT_SECONDARY_COLOR[WorkoutType.SitUp]}
    workoutType={WorkoutType.SitUp}
  />
);

export const PushUpsScreen = () => (
  <Workout
    mainColor={WORKOUT_PRIMARY_COLOR[WorkoutType.PushUp]}
    secondaryColor={WORKOUT_SECONDARY_COLOR[WorkoutType.PushUp]}
    workoutType={WorkoutType.PushUp}
  />
);

export const SquatsScreen = () => (
  <Workout
    mainColor={WORKOUT_PRIMARY_COLOR[WorkoutType.Squat]}
    secondaryColor={WORKOUT_SECONDARY_COLOR[WorkoutType.Squat]}
    workoutType={WorkoutType.Squat}
  />
);
