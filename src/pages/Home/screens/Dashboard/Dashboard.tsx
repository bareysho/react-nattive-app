import React, { FC } from 'react';
import * as dateFns from 'date-fns';
import { ru } from 'date-fns/locale';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Box, Button, HStack, Icon, Text, VStack } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { Card } from '@src/components/Card';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';
import { useIntervalDate } from '@src/hooks/useIntervalDate';
import { WorkoutType } from '@src/enums/WorkoutType';
import { getGroupedWorkoutsRepsTotal } from '@src/utils/workoutRecord';

import { DashboardWorkoutsCard } from './DashboardWorkoutsCard';
import { DashboardCard } from './DashboardCard';

export const Dashboard: FC = () => {
  const todayDateString = dateFns.format(new Date(), 'dd MMMM yyyy', {
    locale: ru,
  });

  const { endDate: todayEndTade, startDate: todayStartTade } = useIntervalDate(
    new Date(),
  );

  const { endDate: weekEndDate, startDate: weekStartDate } = useIntervalDate(
    new Date(),
    -7,
  );

  const bestResults = WorkoutRecords.getGroupedByWorkoutTypeBestResults();

  const todayGroupedWorkoutsRepsTotal = getGroupedWorkoutsRepsTotal(
    Array.from(
      WorkoutRecords.getWorkoutRecordsInDateInterval(
        todayStartTade,
        todayEndTade,
      ),
    ),
  );

  const currentWeekWorkouts = WorkoutRecords.getWorkoutRecordsInDateInterval(
    weekStartDate,
    weekEndDate,
  );

  const currentWeekWorkoutsDates = currentWeekWorkouts.map(currentWeekWorkout =>
    dateFns.format(currentWeekWorkout.workoutDate, 'dd.MM'),
  );

  const getActivityShieldColor = (dateString: string) =>
    currentWeekWorkoutsDates.includes(dateString) ? '#22c55e' : undefined;

  const currentWeekGroupedWorkoutsRepsTotal = getGroupedWorkoutsRepsTotal(
    Array.from(currentWeekWorkouts),
  );

  return (
    <PageLayout>
      <Text fontSize={20} fontWeight={600}>
        Информация
      </Text>

      <Text fontSize={18} fontWeight={300} mt={1}>
        {`Сводка на ${todayDateString}`}
      </Text>

      <Card mt={6}>
        <Text mb={3} fontSize={18}>
          Регулярность:
        </Text>

        <HStack justifyContent="space-between" width="100%">
          {[6, 5, 4, 3, 2, 1, 0].map(item => {
            const dayOfWeekDate = dateFns.subDays(new Date(), item);

            const dayOfWeekString = dateFns
              .format(dayOfWeekDate, 'EEEEEE', {
                locale: ru,
              })
              .toUpperCase();

            const dayOfWeekDateString = dateFns.format(dayOfWeekDate, 'dd.MM');

            return (
              <VStack alignItems="center" key={item}>
                <Text
                  mb={2}
                  fontWeight={item === 7 ? 700 : undefined}
                  textAlign="center"
                >
                  {dayOfWeekString}
                </Text>

                <Icon
                  color={getActivityShieldColor(dayOfWeekDateString)}
                  size={30}
                  as={<MaterialCommunityIcons name="shield-check" />}
                />

                <Text mt={2} fontSize={12}>
                  {dayOfWeekDateString}
                </Text>
              </VStack>
            );
          })}
        </HStack>
      </Card>

      <DashboardCard
        icon={<MaterialCommunityIcons name="scale-bathroom" />}
        bottomButton={
          <Button alignSelf="flex-start" variant="ghost">
            Запись
          </Button>
        }
      >
        <HStack justifyContent="space-between">
          <Box mr={5}>
            <Text fontSize={14}>Текущий вес:</Text>

            <Text textAlign="center" fontSize={28}>
              72 кг
            </Text>
          </Box>

          <Box>
            <Text fontSize={14}>Прошлая неделя:</Text>

            <Text color="#ef4444" textAlign="center" fontSize={28}>
              -2 кг
            </Text>
          </Box>
        </HStack>
      </DashboardCard>

      <DashboardWorkoutsCard
        title="Рекорд за 1 подход:"
        iconColor="#fbbf24"
        icon={<Ionicons name="ios-trophy" />}
        pushUpsCount={bestResults[WorkoutType.PushUp]}
        sitUpsCount={bestResults[WorkoutType.SitUp]}
        squatsCount={bestResults[WorkoutType.Squat]}
      />

      <DashboardWorkoutsCard
        title="Сегодня:"
        iconColor="#22c55e"
        icon={<MaterialCommunityIcons name="shield-check" />}
        pushUpsCount={todayGroupedWorkoutsRepsTotal[WorkoutType.PushUp]}
        sitUpsCount={todayGroupedWorkoutsRepsTotal[WorkoutType.SitUp]}
        squatsCount={todayGroupedWorkoutsRepsTotal[WorkoutType.Squat]}
      />

      <DashboardWorkoutsCard
        title="За неделю:"
        iconColor="#0ea5e9"
        icon={<Ionicons name="ios-today" />}
        pushUpsCount={currentWeekGroupedWorkoutsRepsTotal[WorkoutType.PushUp]}
        sitUpsCount={currentWeekGroupedWorkoutsRepsTotal[WorkoutType.SitUp]}
        squatsCount={currentWeekGroupedWorkoutsRepsTotal[WorkoutType.Squat]}
      />
    </PageLayout>
  );
};
