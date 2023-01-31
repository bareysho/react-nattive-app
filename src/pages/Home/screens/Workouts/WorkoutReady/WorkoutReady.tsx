import React, { FC, useEffect, useRef } from 'react';
import { ActionSheetRef } from 'react-native-actions-sheet';

import { Button, Text, VStack } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { WorkoutType } from '@src/enums/WorkoutType';
import {
  PUSH_UP_WORKOUT_LEVELS,
  WORKOUT_SCREEN_MAPPER,
  WORKOUT_TITLE_MAPPER,
} from '@src/constants/workouts';
import { useAppSelector } from '@src/redux/store';
import { selectWorkout } from '@src/selectors/workout';
import StorageContext from '@src/storage/storage';
import { Card } from '@src/components/Card';

import { SelectLevelActionSheet } from './SelectLevelActionSheet';

const { useQuery } = StorageContext;

interface IWorkoutReady {
  workoutType: WorkoutType;
  mainColor: string;
  secondaryColor: string;
  navigate: (screen: string) => void;
}

export const WorkoutReady: FC<IWorkoutReady> = ({
  workoutType,
  secondaryColor,
  mainColor,
  navigate,
}) => {
  let workouts = useQuery<WorkoutEvent>(WorkoutEvent);

  workouts = workouts
    .filtered('workoutType == $0', workoutType)
    .sorted('workoutDate', true);

  const [workout] = workouts;

  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    return () => actionSheetRef?.current?.hide();
  }, []);

  const { workoutLevel } = useAppSelector(selectWorkout(workoutType));

  const selectedLevelProps =
    workoutLevel && PUSH_UP_WORKOUT_LEVELS[workoutLevel];

  const levelDescription =
    selectedLevelProps &&
    `Подходы: ${selectedLevelProps.sets.join(' - ')}, отдых: ${
      selectedLevelProps.restSec
    } сек`;

  return (
    <PageLayout>
      <VStack flex={1} width="100%" justifyContent="space-between">
        <VStack width="100%" alignItems="center">
          <Text mb={8} fontSize={28}>
            {WORKOUT_TITLE_MAPPER[workoutType]}
          </Text>

          <Text mb={2} fontSize={26} alignSelf="flex-start">
            {`Уровень: ${selectedLevelProps ? workoutLevel : 'Не выбрано'}`}
          </Text>

          {levelDescription ? (
            <Text fontSize={18} mb={5} alignSelf="flex-start">
              {levelDescription}
            </Text>
          ) : null}

          <Text mt={4} fontSize={18} alignSelf="flex-start">
            Последняя тренировка:
          </Text>

          {workout ? (
            <WorkoutRecord isSetsVisible={true} workout={workout} />
          ) : (
            <Card mt={4}>
              <Text alignSelf="flex-start">Это первая ваша тренировка</Text>
            </Card>
          )}
        </VStack>

        <Button
          alignSelf="center"
          backgroundColor={mainColor}
          backgroundColorPressed={secondaryColor}
          onPress={() => navigate(WORKOUT_SCREEN_MAPPER[workoutType])}
          mb={4}
        >
          <Text fontSize={22} color="black" py={5} px={5} fontWeight={400}>
            Начать тренировку
          </Text>
        </Button>

        <VStack width="100%">
          <Button isDisabled mb={5} width="100%">
            Рекорд
          </Button>

          <Button
            backgroundColor={mainColor}
            onPress={() => actionSheetRef.current?.show()}
            width="100%"
          >
            Выбор уровня
          </Button>
        </VStack>
      </VStack>

      <SelectLevelActionSheet
        workoutType={workoutType}
        workoutLevel={workoutLevel}
        actionSheetRef={actionSheetRef}
      />
    </PageLayout>
  );
};
