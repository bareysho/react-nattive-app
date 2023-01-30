import React, { useCallback, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { ScrollView } from 'react-native';

import {
  Box,
  Button,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { useIntervalDate } from '@src/hooks/useIntervalDate';
import { DateService } from '@src/services/dateService';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';

export const History = () => {
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [selectedEventsDate, setSelectedEventsDate] = useState(new Date());

  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const { endDate, startDate } = useIntervalDate(selectedEventsDate);

  const workoutsFiltered = WorkoutRecords.getWorkoutRecordsInDateInterval(
    startDate,
    endDate,
  ).slice(0, 9);

  const selectedRecordsDateString =
    DateService.formatDateUI(selectedEventsDate);

  const isDateEquals =
    DateService.formatDateUI(new Date()) === selectedRecordsDateString;

  const closedCalendarTitle = isDateEquals
    ? 'Выбрать дату'
    : selectedRecordsDateString;

  const buttonTitle = isCalendarOpen ? 'Подтверидть' : closedCalendarTitle;

  const submitButtonIcon = !isCalendarOpen ? (
    <Icon
      mr={3}
      size={20}
      color="#57534e"
      as={<MaterialCommunityIcons name="calendar-search" />}
    />
  ) : undefined;

  const handleSubmitDate = useCallback(() => {
    if (isCalendarOpen) {
      setCalendarOpen(false);
      setSelectedEventsDate(datePickerDate);
    } else {
      setCalendarOpen(true);
    }
  }, [isCalendarOpen, datePickerDate]);

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
  };

  const cleanSelectedDate = useCallback(() => {
    setDatePickerDate(new Date());
    setSelectedEventsDate(new Date());
  }, []);

  return (
    <>
      <ScrollView style={{ width: '100%', backgroundColor: 'black' }}>
        <PageLayout>
          <Text fontSize={20} fontWeight={600}>
            История упражнений
          </Text>

          <Text fontSize={18} fontWeight={300} mt={1}>
            Проанализируйте свои тренировки
          </Text>

          {workoutsFiltered.map(workout => (
            <WorkoutRecord workout={workout} key={workout._id.toString()} />
          ))}
        </PageLayout>
      </ScrollView>

      <VStack bottom={15} width="100%" position="absolute" alignItems="center">
        {isCalendarOpen && (
          <Box
            py={8}
            mb={5}
            width="95%"
            alignItems="center"
            backgroundColor="white"
            rounded={20}
          >
            <Pressable
              top={20}
              right={20}
              position="absolute"
              onPress={handleCloseCalendar}
            >
              <Icon
                size={30}
                color="#57534e"
                as={<MaterialCommunityIcons name="close-circle" />}
              />
            </Pressable>

            <DatePicker
              mode="date"
              textColor="black"
              fadeToColor="none"
              date={datePickerDate}
              maximumDate={new Date()}
              onDateChange={setDatePickerDate}
            />
          </Box>
        )}

        <HStack width="100%" alignItems="center" justifyContent="space-evenly">
          <Button
            alignItems="center"
            minWidth={300}
            onPress={handleSubmitDate}
            leftIcon={submitButtonIcon}
          >
            {buttonTitle}
          </Button>

          {!isDateEquals && (
            <Pressable zIndex={2} onPress={cleanSelectedDate}>
              <Icon
                size={30}
                color="#57534e"
                as={<MaterialCommunityIcons name="close-circle" />}
              />
            </Pressable>
          )}
        </HStack>
      </VStack>
    </>
  );
};
