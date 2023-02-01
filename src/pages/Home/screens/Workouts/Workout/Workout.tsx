import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTimer } from 'use-timer';
import { ActionSheetRef } from 'react-native-actions-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  completeCurrentSet,
  completeWorkout,
  exitWorkout,
  increaseReps,
  increaseSetNumber,
  initializeWorkout,
  setWorkoutLevel,
  setWorkoutState,
  skipCurrentSet,
  WorkoutState,
} from '@src/redux/slices/workoutSlice';
import { TimerType } from '@src/enums/timer';
import { WorkoutType } from '@src/enums/WorkoutType';
import { selectWorkout } from '@src/selectors/workout';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import {
  ActionSheet,
  Button,
  Center,
  ConfirmModal,
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
  WORKOUT_LEVEL_ASYNC_STORAGE_KEY,
  WORKOUT_PRIMARY_COLOR,
  WORKOUT_SECONDARY_COLOR,
} from '@src/constants/workouts';
import { PageLayout } from '@src/components/PageLayout';
import { DateService } from '@src/services/dateService';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';
import { BestWorkoutResult } from '@src/storage/models/BestWorkoutResult';

import { CircleButton } from './CircleButton';

const { useRealm } = StorageContext;

interface IWorkout {
  mainColor: string;
  secondaryColor: string;
  workoutType: WorkoutType;
  navigate: (screen: string) => void;
}

export const Workout: FC<IWorkout> = ({
  mainColor: colorSchema,
  secondaryColor,
  workoutType,
  navigate,
}) => {
  const { theme } = useTheme();

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

  const { sets: initialSets, restSec } = PUSH_UP_WORKOUT_LEVELS[workoutLevel];

  const {
    time: pauseTime,
    start: startPause,
    reset: resetPause,
  } = useTimer({
    timerType: TimerType.Decremental,
    endTime: 0,
    autostart: false,
    initialTime: restSec,
    onTimeOver: () => {
      dispatch(increaseSetNumber({ workoutType }));
      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Working, workoutType }),
      );
    },
  });

  const reinitializeWorkout = useCallback(() => {
    dispatch(
      initializeWorkout({
        sets: initialSets,
        currentSetIndex: 0,
        workoutType,
      }),
    );

    resetWorkoutTimer();
    resetPause();
  }, [dispatch, workoutType, initialSets]);

  useEffect(() => {
    reinitializeWorkout();
    startWorkoutTimer();

    return reinitializeWorkout;
  }, [dispatch, initialSets, workoutType]);

  const {
    repsDone,
    repsDoneTotal,
    currentSetIndex,
    workoutState,
    sets,
    setsDone,
  } = useAppSelector(selectWorkout(workoutType));

  const currentSetReps = useMemo(
    () => sets[currentSetIndex],
    [sets, currentSetIndex],
  );

  const currentSetRepsLeft = useMemo(
    () => currentSetReps - repsDone,
    [currentSetReps, repsDone],
  );

  const handleFinishCurrentSet = useCallback(() => {
    const isCurrentSetLast = currentSetIndex === sets.length - 1;

    if (isCurrentSetLast) {
      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Finished, workoutType }),
      );
    } else {
      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Pause, workoutType }),
      );
    }
  }, [dispatch, currentSetIndex, sets.length, workoutType]);

  useEffect(() => {
    const isSetFinished = currentSetRepsLeft === 0;

    if (isSetFinished) {
      handleFinishCurrentSet();
    }
  }, [currentSetRepsLeft, handleFinishCurrentSet]);

  const [workoutResult, setWorkoutResult] = useState<WorkoutEvent | null>(null);

  const bestWorkout = WorkoutRecords.getWorkoutTypeBestResult(workoutType);

  useEffect(() => {
    if (workoutState === WorkoutState.Working) {
      resetPause();
    }

    if (workoutState === WorkoutState.Pause) {
      startPause();
    }

    if (workoutState === WorkoutState.Finished) {
      stopDurationTimer();
      resetPause();

      dispatch(
        setWorkoutState({ workoutState: WorkoutState.Finished, workoutType }),
      );
      dispatch(increaseSetNumber({ workoutType }));

      let updatedRecord: number | null = null;

      if (
        !bestWorkout ||
        (bestWorkout && setsDone.some(set => set > bestWorkout.reps))
      ) {
        updatedRecord = [...setsDone].sort().reverse()[0];
      }

      realm.write(() => {
        if (updatedRecord) {
          if (bestWorkout) {
            bestWorkout.reps = updatedRecord;
          } else {
            realm.create(
              'BestWorkoutResult',
              BestWorkoutResult.generate({
                userId: user.id,
                workoutType,
                reps: updatedRecord,
              }),
            );
          }
        }

        const result = realm.create<WorkoutEvent>(
          'WorkoutEvent',
          WorkoutEvent.generate({
            userId: user.id,
            sets,
            setsDone,
            workoutType,
            durationTimeSec,
          }),
        );

        setWorkoutResult(result);
      });
    }
  }, [workoutState, user.id, sets, setsDone, workoutType, durationTimeSec]);

  const workoutRepsTotal = sets.reduce((accum, value) => accum + value, 0);

  const buttonProps: Record<
    WorkoutState,
    { title: string; callback: () => void }
  > = {
    [WorkoutState.Working]: {
      title: 'Закончил подход самостоятельно',
      callback: () => {
        dispatch(completeCurrentSet({ workoutType }));

        handleFinishCurrentSet();
      },
    },
    [WorkoutState.Pause]: {
      title: 'Пропустить отдых',
      callback: () => {
        dispatch(
          setWorkoutState({ workoutState: WorkoutState.Working, workoutType }),
        );
        dispatch(increaseSetNumber({ workoutType }));
      },
    },
    [WorkoutState.Finished]: {
      title: '',
      callback: () => {},
    },
  };

  const { title, callback } = buttonProps[workoutState];

  const getSetBlockBackgroundColor = (approachItem: number) => {
    if (approachItem === currentSetIndex) {
      return workoutMainColor;
    }

    if (approachItem < currentSetIndex) {
      return theme.disabledText;
    }

    return theme.cardBackground;
  };

  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    return () => actionSheetRef?.current?.hide();
  }, []);

  const updateWorkoutLevel = async (updatedWorkoutLevel: number) => {
    dispatch(
      setWorkoutLevel({
        workoutType,
        level: updatedWorkoutLevel,
      }),
    );

    await AsyncStorage.setItem(
      WORKOUT_LEVEL_ASYNC_STORAGE_KEY[workoutType],
      `${updatedWorkoutLevel}`,
    );
  };

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
            {sets.map((setListReps, index) => (
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
                    (index === currentSetIndex && LIGHT_PRIMARY_COLORS.text) ||
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
            value={(repsDoneTotal / workoutRepsTotal) * 100}
          />

          {workoutResult ? (
            <WorkoutRecord isSetsVisible workout={workoutResult} />
          ) : (
            <>
              <HStack>
                <Text>Длительность: </Text>

                <Text fontWeight={600}>
                  {DateService.secondsToDurationString(durationTimeSec)}
                </Text>
              </HStack>

              <HStack>
                <Text>Всего повторений: </Text>

                <Text fontWeight={600}>{workoutRepsTotal}</Text>
              </HStack>

              <HStack>
                <Text>Повторений выполнено: </Text>

                <Text fontWeight={600}>{repsDoneTotal}</Text>
              </HStack>
            </>
          )}
        </VStack>

        {workoutState === WorkoutState.Finished && (
          <>
            <Icon size={160} as={<FontAwesome5 name="flag-checkered" />} />

            <VStack width="100%">
              <Button
                mb={4}
                width="100%"
                backgroundColor={workoutMainColor}
                backgroundColorPressed={secondaryColor}
                onPress={async () => {
                  await updateWorkoutLevel(workoutLevel - 1);

                  navigate('Home');
                }}
              >
                Сложно
              </Button>

              <Button
                mb={4}
                width="100%"
                backgroundColor={workoutMainColor}
                backgroundColorPressed={secondaryColor}
                onPress={() => {
                  navigate('Home');
                }}
              >
                Как раз
              </Button>

              <Button
                mb={4}
                width="100%"
                backgroundColor={workoutMainColor}
                backgroundColorPressed={secondaryColor}
                onPress={async () => {
                  await updateWorkoutLevel(workoutLevel + 1);

                  navigate('Home');
                }}
              >
                Легко
              </Button>
            </VStack>
          </>
        )}

        {workoutState !== WorkoutState.Finished && (
          <>
            <Center width="100%">
              {workoutState === WorkoutState.Working && (
                <CircleButton
                  shadow={1}
                  text={currentSetReps - repsDone}
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
            </Center>

            <Center width="100%">
              <ActionSheet actionSheetRef={actionSheetRef}>
                {workoutState !== WorkoutState.Pause && (
                  <ConfirmModal
                    modalTitle="Пропустить подход?"
                    modalDescription={
                      'Будет выполнен переход к следующему подходу. \n\nЗапишутся только выполненные упражнения.'
                    }
                    renderComponent={toggleOpen => (
                      <Button
                        mb={4}
                        width="100%"
                        backgroundColor={workoutMainColor}
                        backgroundColorPressed={secondaryColor}
                        onPress={toggleOpen}
                      >
                        Пропустить подход
                      </Button>
                    )}
                    confirm={() => {
                      dispatch(skipCurrentSet({ workoutType }));

                      handleFinishCurrentSet();

                      actionSheetRef?.current?.hide();
                    }}
                    confirmButtonTitle="Пропустить"
                  />
                )}

                <ConfirmModal
                  modalTitle="Прекратить тренировку?"
                  modalDescription={
                    'Вы действительно хотите закончить тренировку? \n\nЗапишутся только выполненные подходы.'
                  }
                  renderComponent={toggleOpen => (
                    <Button
                      mb={4}
                      width="100%"
                      backgroundColor={workoutMainColor}
                      backgroundColorPressed={secondaryColor}
                      onPress={toggleOpen}
                    >
                      Прекратить тренировку
                    </Button>
                  )}
                  confirm={() => {
                    dispatch(exitWorkout({ workoutType }));

                    actionSheetRef?.current?.hide();
                  }}
                  confirmButtonTitle="Закончить"
                />

                <ConfirmModal
                  modalTitle="Завершить тренировку?"
                  modalDescription={
                    'Вы действительно хотите завершить тренировку самостоятельно? \n\nВсе оставшиеся подходы запишутся как выполненные.'
                  }
                  renderComponent={toggleOpen => (
                    <Button
                      mb={4}
                      width="100%"
                      backgroundColor={workoutMainColor}
                      backgroundColorPressed={secondaryColor}
                      onPress={toggleOpen}
                    >
                      Завершить самостоятельно
                    </Button>
                  )}
                  confirm={() => {
                    dispatch(completeWorkout({ workoutType }));

                    actionSheetRef?.current?.hide();
                  }}
                  confirmButtonTitle="Закончить"
                />
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
                  backgroundColorPressed={secondaryColor}
                  onPress={() => actionSheetRef?.current?.show()}
                  rightIcon={
                    <MaterialCommunityIcons
                      size={26}
                      name="arrow-up-drop-circle"
                      color={LIGHT_PRIMARY_COLORS.text}
                    />
                  }
                />
              </HStack>
            </Center>
          </>
        )}
      </VStack>
    </PageLayout>
  );
};

export const SitUpsScreen: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => (
  <Workout
    mainColor={WORKOUT_PRIMARY_COLOR[WorkoutType.SitUp]}
    secondaryColor={WORKOUT_SECONDARY_COLOR[WorkoutType.SitUp]}
    workoutType={WorkoutType.SitUp}
    navigate={navigation.navigate}
  />
);

export const PushUpsScreen: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => (
  <Workout
    mainColor={WORKOUT_PRIMARY_COLOR[WorkoutType.PushUp]}
    secondaryColor={WORKOUT_SECONDARY_COLOR[WorkoutType.PushUp]}
    workoutType={WorkoutType.PushUp}
    navigate={navigation.navigate}
  />
);

export const SquatsScreen: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => (
  <Workout
    mainColor={WORKOUT_PRIMARY_COLOR[WorkoutType.Squat]}
    secondaryColor={WORKOUT_SECONDARY_COLOR[WorkoutType.Squat]}
    workoutType={WorkoutType.Squat}
    navigate={navigation.navigate}
  />
);
