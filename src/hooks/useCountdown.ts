import { useCallback, useEffect, useState } from 'react';
import { useTimer } from 'use-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TimerName, TimerState, TimerType } from '@src/enums/timer';

export const useCountdown = (
  countDownSeconds: number,
  timerName: TimerName,
) => {
  const [timeFromLS, setTimeFromLS] = useState<string>();

  useEffect(() => {
    (async () => {
      const storageValue = await AsyncStorage.getItem(timerName);

      setTimeFromLS(storageValue || '');
    })();
  }, []);

  const getCurrentTime = useCallback(() => {
    if (!timeFromLS) return 0;

    const timePast = (new Date().getTime() - Number(timeFromLS)) / 1000;
    const timeLeft = Math.round(countDownSeconds - timePast);

    return timeLeft > 0 ? timeLeft : 0;
  }, [timeFromLS]);

  const [timerState, setTimerState] = useState(TimerState.Initial);

  const { start, advanceTime, time, reset } = useTimer({
    timerType: TimerType.Decremental,
    endTime: 0,
    onTimeOver: () => {
      setTimerState(TimerState.Ended);
    },
  });

  useEffect(() => {
    if (timeFromLS !== undefined) {
      reset();
      start();
      advanceTime(getCurrentTime() * -1);
    }
  }, [timeFromLS, advanceTime, timerState, start]);

  const handleStart = useCallback(async () => {
    const storageTime = `${new Date().getTime()}`;

    await AsyncStorage.setItem(timerName, storageTime);

    setTimerState(TimerState.Started);
    setTimeFromLS(storageTime);
  }, [advanceTime, start]);

  return {
    time,
    start: handleStart,
    isInitializing: timeFromLS === undefined,
  };
};
