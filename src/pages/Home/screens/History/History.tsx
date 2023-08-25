import React, { useCallback, useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { FlatList } from 'react-native';

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
import { useAppSelector } from '@src/redux/store';
import { selectAuthState } from '@src/selectors/auth';
import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { sliceIntoChunks } from '@src/utils/array';

export const History = () => {
  const { user } = useAppSelector(selectAuthState);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [selectedEventsDate, setSelectedEventsDate] = useState<Date | null>(
    null,
  );

  const { endDate, startDate } = useIntervalDate(
    selectedEventsDate || new Date(),
  );

  const userWorkouts = WorkoutRecords.getWorkoutsByUser(user.id);

  const workoutsFiltered = WorkoutRecords.getWorkoutRecordsInDateInterval(
    startDate,
    endDate,
    userWorkouts,
  );

  const workouts = selectedEventsDate ? workoutsFiltered : userWorkouts;

  const selectDateButtonTitle = selectedEventsDate
    ? DateService.formatDateUI(selectedEventsDate)
    : 'Выбрать дату';

  const cleanSelectedDate = useCallback(() => {
    setDatePickerDate(new Date());
    setSelectedEventsDate(null);
  }, []);

  const { theme } = useTheme();

  const [page, setPage] = useState(0);

  const data = sliceIntoChunks(Array.from<WorkoutEvent>(workouts), 6);

  const [currentData, setCurrentData] = useState(data[page] || []);

  const flatListRef = useRef<FlatList | null>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <>
      <PageLayout pt={4} px={4} p={0}>
        <Text fontSize={20} fontWeight={600}>
          История упражнений
        </Text>

        <Text fontSize={18} fontWeight={300} mt={1}>
          Проанализируйте свои тренировки
        </Text>

        {data.length ? (
          <>
            <Text alignSelf="flex-end" fontWeight={300} mb={1} mt={3}>
              Страница: <Text fontWeight={500}>{page + 1}</Text>
            </Text>

            <FlatList<WorkoutEvent>
              data={currentData}
              style={{
                width: '100%',
              }}
              keyExtractor={item => item._id.toString()}
              renderItem={info => <WorkoutRecord workout={info.item} />}
              contentContainerStyle={{
                width: '97%',
                minHeight: '101%',
              }}
              ref={flatListRef}
              initialNumToRender={6}
              onEndReached={() => {
                const nextChunk = data[page + 1];

                if (nextChunk) {
                  setPage(page + 1);
                  setCurrentData(prevState => [...prevState, ...nextChunk]);
                }
              }}
            />
          </>
        ) : (
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Text fontWeight={500} fontSize={20}>
              Не найдено
            </Text>
          </Box>
        )}
      </PageLayout>

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

          {selectedEventsDate && (
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
