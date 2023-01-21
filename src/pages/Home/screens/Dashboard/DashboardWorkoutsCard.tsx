import React, { FC, ReactElement } from 'react';
import { HStack, Text } from 'native-base';

import { ImageApp, ImageAppName } from '@src/components/Image/Image';

import { DashboardCard } from './DashboardCard';

interface IRepetitionsCount {
  iconName: ImageAppName;
  count: number;
}

const RepetitionsCount: FC<IRepetitionsCount> = ({ iconName, count = 0 }) => {
  return (
    <HStack mr={8} alignItems="center">
      <ImageApp name={iconName} size={30} />

      <Text ml={2} fontSize={24}>
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
