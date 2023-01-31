import React, { useCallback, useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { ScrollView } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';

import {
  ActionSheet,
  Box,
  Button,
  HStack,
  Icon,
  Pressable,
  Text,
  useTheme,
  VStack,
} from '@src/components/UI';
import { PageLayout } from '@src/components/PageLayout';
import { useIntervalDate } from '@src/hooks/useIntervalDate';
import { DateService } from '@src/services/dateService';
import { WorkoutRecord } from '@src/pages/Home/screens/History/WorkoutRecord';
import { WorkoutRecords } from '@src/storage/repositories/workoutRecords';
import { LIGHT_PRIMARY_COLORS } from '@src/components/UI/components/ThemeProvider/lightPrimary';

export const History = () => {
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [selectedEventsDate, setSelectedEventsDate] = useState(new Date());

  const { endDate, startDate } = useIntervalDate(selectedEventsDate);

  const workoutsFiltered = WorkoutRecords.getWorkoutRecordsInDateInterval(
    startDate,
    endDate,
  );

  const selectedRecordsDateString =
    DateService.formatDateUI(selectedEventsDate);

  const isDateEquals =
    DateService.formatDateUI(new Date()) === selectedRecordsDateString;

  const selectDateButtonTitle = isDateEquals
    ? 'Выбрать дату'
    : selectedRecordsDateString;

  const cleanSelectedDate = useCallback(() => {
    setDatePickerDate(new Date());
    setSelectedEventsDate(new Date());
  }, []);

  const { theme } = useTheme();

  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <>
      <ScrollView style={{ width: '100%', backgroundColor: theme.background }}>
        <PageLayout>
          <Text fontSize={20} fontWeight={600}>
            История упражнений
          </Text>

          <Text fontSize={18} fontWeight={300} mt={1}>
            Проанализируйте свои тренировки
          </Text>

          <Box width="100%" mb={10}>
            {workoutsFiltered.slice(0, 6).map(workout => (
              <WorkoutRecord workout={workout} key={workout._id.toString()} />
            ))}
          </Box>
        </PageLayout>
      </ScrollView>

      <ActionSheet actionSheetRef={actionSheetRef}>
        <DatePicker
          mode="date"
          textColor={theme.text}
          fadeToColor="none"
          locale="ru"
          date={datePickerDate}
          maximumDate={new Date()}
          onDateChange={setDatePickerDate}
        />

        <Button
          mt={6}
          width="100%"
          onPress={() => {
            setSelectedEventsDate(datePickerDate);

            actionSheetRef?.current?.hide();
          }}
        >
          Подтвердить
        </Button>
      </ActionSheet>

      <VStack bottom={15} width="100%" position="absolute" alignItems="center">
        <HStack width="100%" alignItems="center" justifyContent="space-evenly">
          <Button
            alignItems="center"
            minWidth={300}
            onPress={() => actionSheetRef?.current?.show()}
            leftIcon={
              <Icon
                mr={3}
                size={20}
                color={LIGHT_PRIMARY_COLORS.text}
                as={<MaterialCommunityIcons name="calendar-search" />}
              />
            }
          >
            {selectDateButtonTitle}
          </Button>

          {!isDateEquals && (
            <Pressable zIndex={2} rounded={10} onPress={cleanSelectedDate}>
              <Icon
                size={30}
                as={<MaterialCommunityIcons name="close-circle" />}
              />
            </Pressable>
          )}
        </HStack>
      </VStack>
    </>
  );
};
