import { Results } from 'realm';

import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import StorageContext from '@src/storage/storage';

const { useQuery } = StorageContext;

export class WorkoutRecords {
  public static getWorkoutRecordsInDateInterval = (
    startDate: Date,
    endDate: Date,
    existsWorkoutsResult?: Results<WorkoutEvent>,
  ) => {
    const workouts = existsWorkoutsResult
      ? existsWorkoutsResult
      : useQuery<WorkoutEvent>(WorkoutEvent);

    return workouts
      .filtered('workoutDate >= $0 && workoutDate =< $1', startDate, endDate)
      .sorted('workoutDate', true);
  };
}
