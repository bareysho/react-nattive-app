import React, { FC, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Card } from '@src/components/Card';
import { ImageApp } from '@src/components/Image/Image';
import { IMAGE_BY_WORKOUT_MAPPER } from '@src/constants/workouts';
import { DateService } from '@src/services/dateService';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { Box, HStack, Icon, Pressable, Text, VStack } from '@src/components/UI';

interface IWorkoutRecord {
  workout: WorkoutEvent;
  isSetsVisible?: boolean;
}

export const WorkoutRecord: FC<IWorkoutRecord> = ({
  workout,
  isSetsVisible: initialSetsVisible = false,
}) => {
  const [isSetsVisible, setSetsVisible] = useState(initialSetsVisible);

  return (
    <Card mt={5} width="100%" key={workout._id.toString()}>
      <HStack alignItems="flex-start">
        <Box mr={6}>
          <ImageApp name={IMAGE_BY_WORKOUT_MAPPER[workout.workoutType]} />
        </Box>

        <VStack flex={1}>
          <HStack mb={2} alignItems="center">
            <Icon
              mr={2}
              as={<MaterialCommunityIcons name="calendar-clock" />}
            />

            <Text fontSize={14} mr={10}>
              {DateService.formatDatetimeUI(workout.workoutDate)}
            </Text>
          </HStack>

          <HStack mb={2} alignItems="center">
            <Icon
              mr={2}
              as={<MaterialCommunityIcons name="timer-sand-complete" />}
            />

            <Text fontSize={14}>
              {DateService.secondsToDurationString(workout.durationTimeSec)}
            </Text>
          </HStack>

          <Pressable
            rounded={4}
            p={1}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
            onPress={() => {
              setSetsVisible(prev => !prev);
            }}
          >
            <Text>Подходы</Text>

            <Icon
              mt={1}
              as={
                <MaterialIcons
                  name={
                    isSetsVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                  }
                />
              }
            />
          </Pressable>

          {isSetsVisible && (
            <HStack mt={2}>
              {workout.sets.map((currentSetReps, index) => {
                const repsDone = workout.setsDone[index] || 0;

                const isSetFullCompleted = repsDone === currentSetReps;

                return (
                  <HStack alignItems="center" key={index} mr={2}>
                    <Icon
                      color={isSetFullCompleted ? '#4ade80' : '#f87171'}
                      as={<Entypo name="check" />}
                    />

                    <Text fontSize={14}>{`${repsDone}/${currentSetReps}`}</Text>
                  </HStack>
                );
              })}
            </HStack>
          )}
        </VStack>
      </HStack>
    </Card>
  );
};
