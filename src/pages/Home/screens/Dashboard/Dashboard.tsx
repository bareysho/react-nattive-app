import React, { FC } from 'react';
import { Box, Button, Heading, HStack, Icon, Text, VStack } from 'native-base';
import * as dateFns from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ru } from 'date-fns/locale';

import { PageLayout } from '@src/components/PageLayout';
import { Card } from '@src/components/Card';

import { DashboardWorkoutsCard } from './DashboardWorkoutsCard';
import { DashboardCard } from './DashboardCard';

export const Dashboard: FC = () => {
  const completed = [1, 2, 3];

  const getActivityShieldColor = (i: number) =>
    completed.includes(i) ? 'green.500' : undefined;

  const todayDateString = dateFns.format(new Date(), 'dd MMMM yyyy', {
    locale: ru,
  });

  return (
    <PageLayout>
      <Heading size="lg" fontWeight="600">
        Информация
      </Heading>

      <Heading mt={1} fontWeight="medium" size="xs">
        {`Сводка на ${todayDateString}`}
      </Heading>

      <Card>
        <Text mb={3} fontSize={18}>
          Регулярность:
        </Text>

        <HStack justifyContent="space-between">
          {[1, 2, 3, 4, 5, 6, 7].map(item => {
            const dayOfWeek = dateFns
              .format(dateFns.addDays(new Date(), item), 'EEEEEE', {
                locale: ru,
              })
              .toUpperCase();

            return (
              <VStack key={item}>
                <Text mb={2} fontWeight={item === 7 ? 'bold' : undefined} textAlign="center">
                  {dayOfWeek}
                </Text>

                <Icon
                  color={getActivityShieldColor(item)}
                  size={8}
                  as={<MaterialCommunityIcons name="shield-check" />}
                />
              </VStack>
            );
          })}
        </HStack>
      </Card>

      <DashboardCard
        icon={<MaterialCommunityIcons name="scale-bathroom" />}
        bottomButton={
          <Button alignSelf="flex-start" py={0} px={1} variant="ghost">
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

            <Text color="red.500" textAlign="center" fontSize={28}>
              -2 кг
            </Text>
          </Box>
        </HStack>
      </DashboardCard>

      <DashboardWorkoutsCard
        title="Рекорд:"
        iconColor="amber.400"
        icon={<Ionicons name="ios-trophy" />}
        pushUpsCount={15}
        sitUpsCount={11}
        squatsCount={29}
      />

      <DashboardWorkoutsCard
        title="Сегодня:"
        iconColor="emerald.300"
        icon={<MaterialCommunityIcons name="shield-check" />}
        pushUpsCount={15}
        sitUpsCount={11}
        squatsCount={29}
      />

      <DashboardWorkoutsCard
        title="За неделю:"
        iconColor="violet.500"
        icon={<Ionicons name="ios-today" />}
        pushUpsCount={15}
        sitUpsCount={11}
        squatsCount={29}
      />
    </PageLayout>
  );
};
