import React, { FC, useEffect, useRef } from 'react';
import { ActionSheetRef } from 'react-native-actions-sheet';

import { Box, Button, Text, VStack } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { ImageApp } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';
import {
  IMAGE_BY_WORKOUT_MAPPER,
  PUSH_UP_WORKOUT_LEVELS,
  WORKOUT_SCREEN_MAPPER,
  WORKOUT_TITLE_MAPPER,
} from '@src/constants/workouts';
import { useAppSelector } from '@src/redux/store';
import { selectWorkout } from '@src/selectors/workout';
import StorageContext from '@src/storage/storage';

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

  workouts = workouts.filtered('workoutType == $0', workoutType);

  const [workout] = workouts;

  const actionSheetRef = useRef<ActionSheetRef>(null);

  useEffect(() => {
    return () => actionSheetRef?.current?.hide();
  }, []);

  const { workoutLevel } = useAppSelector(selectWorkout(workoutType));

  const selectedLevelProps =
    workoutLevel && PUSH_UP_WORKOUT_LEVELS[workoutLevel];

  return (
    <PageLayout>
      <VStack flex={1} width="100%" justifyContent="space-between">
        <VStack width="100%" alignItems="center">
          <Text fontSize={28}>{WORKOUT_TITLE_MAPPER[workoutType]}</Text>

          <Box my={2}>
            <ImageApp size={120} name={IMAGE_BY_WORKOUT_MAPPER[workoutType]} />
          </Box>

          <Text mb={2} fontSize={22} alignSelf="flex-start">
            {`Уровень: ${selectedLevelProps ? workoutLevel : 'Не выбрано'}`}
          </Text>

          {selectedLevelProps ? (
            <>
              <Text alignSelf="flex-start">{`Подходы: ${selectedLevelProps.set.join(
                ' - ',
              )}`}</Text>

              <Text
                mb={5}
                alignSelf="flex-start"
              >{`Отдых: ${selectedLevelProps.restSec}`}</Text>
            </>
          ) : null}

          <Text fontSize={18} alignSelf="flex-start">
            Последняя тренировка:
          </Text>

          <WorkoutRecord workout={workout} />
        </VStack>

        <VStack width="100%">
          <Button
            alignSelf="center"
            backgroundColor={mainColor}
            backgroundColorPressed={secondaryColor}
            onPress={() => navigate(WORKOUT_SCREEN_MAPPER[workoutType])}
            mb={12}
          >
            <Text fontSize={22} color="black" py={4} px={5} fontWeight={400}>
              Начать тренировку
            </Text>
          </Button>

          <Button isDisabled mb={5} width="100%">
            Рекорд
          </Button>

          <Button onPress={() => actionSheetRef.current?.show()} width="100%">
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
