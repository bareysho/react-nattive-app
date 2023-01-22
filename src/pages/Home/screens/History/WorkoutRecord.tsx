import React, { FC } from 'react';
import { Box, HStack, Icon, Text, VStack } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Card } from '@src/components/Card';
import { ImageApp } from '@src/components/Image/Image';
import { IMAGE_BY_WORKOUT_MAPPER } from '@src/constants/imageByWorkoutMapper';
import { DateService } from '@src/services/dateService';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';

interface IWorkoutRecord {
  workout: WorkoutEvent;
}

export const WorkoutRecord: FC<IWorkoutRecord> = ({ workout }) => {
  return (
    <Card key={workout._id.toString()}>
      <HStack alignItems="center">
        <Box mr={6}>
          <ImageApp name={IMAGE_BY_WORKOUT_MAPPER[workout.workoutType]} />
        </Box>

        <VStack>
          <HStack alignItems="center">
            <Icon
              mr={2}
              as={<MaterialCommunityIcons name="calendar-clock" />}
            />

            <Text mr={10} color="gray.400">
              {DateService.formatDatetimeUI(workout.workoutDate)}
            </Text>
          </HStack>

          <HStack alignItems="center">
            <Icon
              mr={2}
              as={<MaterialCommunityIcons name="timer-sand-complete" />}
            />

            <Text>{workout.durationTimeSec} секунд</Text>
          </HStack>

          <Text>Подходы:</Text>

          <HStack>
            {workout.setList.map((setRepetitionsCount, index) => (
              <HStack alignItems="center" key={setRepetitionsCount} mr={2}>
                <Text mr={1}>{setRepetitionsCount}</Text>

                <Icon
                  color={index < 2 ? 'green.400' : 'red.400'}
                  as={<Entypo name="check" />}
                />
              </HStack>
            ))}
          </HStack>
        </VStack>
      </HStack>
    </Card>
  );
};
