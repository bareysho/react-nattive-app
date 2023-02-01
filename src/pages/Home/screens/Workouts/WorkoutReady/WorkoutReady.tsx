import React, { FC, useEffect, useRef } from 'react';
import { ActionSheetRef } from 'react-native-actions-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, HStack, Icon, Text, VStack } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutType } from '@src/enums/WorkoutType';
import {
  PUSH_UP_WORKOUT_LEVELS,
  WORKOUT_SCREEN_MAPPER,
  WORKOUT_TITLE_MAPPER,
} from '@src/constants/workouts';
import { useAppSelector } from '@src/redux/store';
import { selectWorkout } from '@src/selectors/workout';
import { Card } from '@src/components/Card';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';

import { SelectLevelActionSheet } from './SelectLevelActionSheet';

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
  const [lastWorkout] = WorkoutRecords.getWorkoutsByType(workoutType);

  const bestWorkout = WorkoutRecords.getWorkoutTypeBestResult(workoutType);

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
          <Text mb={6} fontSize={28}>
            {WORKOUT_TITLE_MAPPER[workoutType].toUpperCase()}
          </Text>

          <HStack mb={8} justifyContent="space-between" width="100%">
            <HStack alignItems="center">
              <Icon mr={2} as={<Ionicons name="star" />} />

              <Text fontSize={24} textAlign="left">
                {`Уровень: ${selectedLevelProps ? workoutLevel : 'Не выбрано'}`}
              </Text>
            </HStack>

            {bestWorkout && (
              <HStack alignItems="center">
                <Icon mr={2} as={<Ionicons name="ios-trophy" />} />

                <Text fontSize={24}>{`Рекорд: ${bestWorkout.reps}`}</Text>
              </HStack>
            )}
          </HStack>

          {levelDescription ? (
            <Text fontSize={18} mb={5} alignSelf="flex-start">
              {levelDescription}
            </Text>
          ) : null}

          <Text mt={4} fontSize={18} alignSelf="flex-start">
            Последняя тренировка:
          </Text>

          {lastWorkout ? (
            <WorkoutRecord isSetsVisible={true} workout={lastWorkout} />
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
          <Button
            mb={5}
            isDisabled
            width="100%"
            backgroundColor={mainColor}
            backgroundColorPressed={secondaryColor}
          >
            Рекорд
          </Button>

          <Button
            backgroundColor={mainColor}
            backgroundColorPressed={secondaryColor}
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
        backgroundColor={mainColor}
        backgroundColorPressed={secondaryColor}
        actionSheetRef={actionSheetRef}
      />
    </PageLayout>
  );
};
