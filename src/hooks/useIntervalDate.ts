import { addDays, set, subDays } from 'date-fns';

const applyDelta = (date: Date, delta: number) => {
  return delta >= 0 ? addDays(date, delta) : subDays(date, delta * -1);
};

export const useIntervalDate = (date: Date, delta = 0) => {
  const startDate = set(date, { hours: 23, minutes: 59, seconds: 59 });
  const endDate = set(applyDelta(date, delta), {
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  if (startDate > endDate) {
    return {
      startDate: endDate,
      endDate: startDate,
    };
  }

  return {
    startDate,
    endDate,
  };
};
