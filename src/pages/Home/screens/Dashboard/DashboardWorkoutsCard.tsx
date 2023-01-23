import React, { FC, ReactElement } from 'react';

import { HStack, Text } from '@src/components/UI';
import { ImageApp, ImageAppName } from '@src/components/Image/Image';

import { DashboardCard } from './DashboardCard';

interface IRepetitionsCount {
  iconName: ImageAppName;
  count: number;
}

const RepetitionsCount: FC<IRepetitionsCount> = ({ iconName, count = 0 }) => {
  const fontSize = count.toString().length > 2 ? 18 : 24;

  return (
    <HStack mr={6} alignItems="center">
      <ImageApp name={iconName} size={30} />

      <Text minWidth={9} ml={2} fontSize={fontSize}>
        {count}
      </Text>
    </HStack>
  );
};

interface IDashboardWorkoutsCard {
  title: string;
  icon: ReactElement;
  squatsCount: number;
  pushUpsCount: number;
  sitUpsCount: number;
  iconColor?: string;
}

export const DashboardWorkoutsCard: FC<IDashboardWorkoutsCard> = ({
  title,
  icon,
  iconColor,
  squatsCount,
  pushUpsCount,
  sitUpsCount,
}) => {
  return (
    <DashboardCard title={title} icon={icon} iconColor={iconColor}>
      <HStack justifyContent="space-between">
        <RepetitionsCount iconName={ImageAppName.Squat} count={squatsCount} />

        <RepetitionsCount iconName={ImageAppName.PushUp} count={pushUpsCount} />

        <RepetitionsCount iconName={ImageAppName.SitUp} count={sitUpsCount} />
      </HStack>
    </DashboardCard>
  );
};
