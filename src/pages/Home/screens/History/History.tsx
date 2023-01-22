import React, { useState } from 'react';
import {
  Actionsheet,
  Box,
  Button,
  Center,
  Heading,
  Icon,
  Text,
  useDisclose,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';

import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { PageLayout } from '@src/components/PageLayout';
import { useIntervalDate } from '@src/hooks/useIntervalDate';
import { DateService } from '@src/services/dateService';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';


export const History = () => {
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [selectedEventsDate, setSelectedEventsDate] = useState(new Date());

  const { isOpen, onOpen, onClose } = useDisclose();

  const handleClose = () => {
    setSelectedEventsDate(datePickerDate);
    onClose();
  };

  const { endDate, startDate } = useIntervalDate(selectedEventsDate);

  const workoutsFiltered = WorkoutRecords.getWorkoutRecordsInDateInterval(
    startDate,
    endDate,
  );

  const selectedRecordsDateString = DateService.formatDateUI(selectedEventsDate);

  const isDateEquals =
    DateService.formatDateUI(new Date()) === selectedRecordsDateString;

  const buttonTitle = isDateEquals ? 'Выбрать дату' : selectedRecordsDateString;

  return (
    <Box height="100%">
      <PageLayout>
        <Heading size="lg" fontWeight="600">
          История упражнений
        </Heading>

        <Heading mt={1} fontWeight="medium" size="xs">
          Проанализируйте свои тренировки
        </Heading>

        {workoutsFiltered.map(workout => (
          <WorkoutRecord workout={workout} key={workout._id.toString()} />
        ))}
      </PageLayout>

      <Center
        width="95%"
        bottom={5}
        position="absolute"
        justifyContent="space-between">
        {!isDateEquals && (
          <Icon
            onPress={() => {
              setSelectedEventsDate(new Date());
            }}
            zIndex={2}
            right={2}
            bottom={3}
            size="lg"
            color="gray.600"
            position="absolute"
            as={<MaterialCommunityIcons name="close-circle" />}
          />
        )}

        <Button
          onPress={onOpen}
          alignItems="center"
          minWidth={300}
          leftIcon={
            <Icon
              mr={3}
              size="lg"
              color="gray.600"
              as={<MaterialCommunityIcons name="calendar-search" />}
            />
          }>
          <Text>{buttonTitle}</Text>
        </Button>

        <Actionsheet useRNModal isOpen={isOpen} onClose={handleClose}>
          <Actionsheet.Content>
            <DatePicker
              mode="date"
              textColor="black"
              fadeToColor="none"
              date={datePickerDate}
              maximumDate={new Date()}
              onDateChange={setDatePickerDate}
            />
          </Actionsheet.Content>
        </Actionsheet>
      </Center>
    </Box>
  );
};
