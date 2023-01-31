import React, { FC } from 'react';
import * as dateFns from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ru } from 'date-fns/locale';
import { Results } from 'realm';

import { Box, HStack, Text, VStack, Icon, Button } from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { Card } from '@src/components/Card';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';
import { useIntervalDate } from '@src/hooks/useIntervalDate';
import { WorkoutType } from '@src/enums/WorkoutType';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';

import { DashboardWorkoutsCard } from './DashboardWorkoutsCard';
import { DashboardCard } from './DashboardCard';

export const Dashboard: FC = () => {
  const completed = [1, 2, 3];

  const getActivityShieldColor = (i: number) =>
    completed.includes(i) ? undefined : '#22c55e';

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

  console.log({ todayEndTade, todayStartTade });
  console.log({ weekEndDate, weekStartDate });

  const separateByType = (workoutsToday: Results<WorkoutEvent>) =>
    workoutsToday.reduce<Record<WorkoutType, WorkoutEvent[]>>(
      (accum, item) => {
        return {
          ...accum,
          [item.workoutType]: [...accum[item.workoutType], item],
        };
      },
      {
        [WorkoutType.SitUp]: [],
        [WorkoutType.Squat]: [],
        [WorkoutType.PushUp]: [],
      },
    );

  const getSums = (workoutsToday: Record<WorkoutType, WorkoutEvent[]>) =>
    Object.entries(workoutsToday).reduce<Record<WorkoutType, number>>(
      (accum, [key, value]) => {
        return {
          ...accum,
          [key]:
            accum[key as WorkoutType] +
            value.reduce(
              (accumWorkouts, workoutEvent) =>
                accumWorkouts +
                workoutEvent.sets.reduce((sum, v) => sum + v, 0),
              0,
            ),
        };
      },
      {
        [WorkoutType.SitUp]: 0,
        [WorkoutType.Squat]: 0,
        [WorkoutType.PushUp]: 0,
      },
    );

  const sumsToday = getSums(
    separateByType(
      WorkoutRecords.getWorkoutRecordsInDateInterval(
        todayStartTade,
        todayEndTade,
      ),
    ),
  );

  const sumsThisWeek = getSums(
    separateByType(
      WorkoutRecords.getWorkoutRecordsInDateInterval(
        weekStartDate,
        weekEndDate,
      ),
    ),
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
          {[1, 2, 3, 4, 5, 6, 7].map(item => {
            const dayOfWeek = dateFns
              .format(dateFns.addDays(new Date(), item), 'EEEEEE', {
                locale: ru,
              })
              .toUpperCase();

            return (
              <VStack key={item}>
                <Text
                  mb={2}
                  fontWeight={item === 7 ? 700 : undefined}
                  textAlign="center"
                >
                  {dayOfWeek}
                </Text>

                <Icon
                  color={getActivityShieldColor(item)}
                  size={30}
                  as={
                    <MaterialCommunityIcons
                      color={getActivityShieldColor(item)}
                      name="shield-check"
                    />
                  }
                />
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
        title="Рекорд:"
        iconColor="#fbbf24"
        icon={<Ionicons name="ios-trophy" />}
        pushUpsCount={15}
        sitUpsCount={11}
        squatsCount={29}
      />

      <DashboardWorkoutsCard
        title="Сегодня:"
        iconColor="#6ee7b7"
        icon={<MaterialCommunityIcons name="shield-check" />}
        pushUpsCount={sumsToday[WorkoutType.PushUp]}
        sitUpsCount={sumsToday[WorkoutType.SitUp]}
        squatsCount={sumsToday[WorkoutType.Squat]}
      />

      <DashboardWorkoutsCard
        title="За неделю:"
        iconColor="#f97316"
        icon={<Ionicons name="ios-today" />}
        pushUpsCount={sumsThisWeek[WorkoutType.PushUp]}
        sitUpsCount={sumsThisWeek[WorkoutType.SitUp]}
        squatsCount={sumsThisWeek[WorkoutType.Squat]}
      />
    </PageLayout>
  );
};
