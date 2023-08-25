import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { BestWorkoutResult } from '@src/storage/models/BestWorkoutResult';
import { WorkoutType } from '@src/enums/WorkoutType';
import StorageContext from '@src/storage/storage';

const { useQuery } = StorageContext;

export class WorkoutRecords {
  public static getWorkoutsByUser = (userId: string) => {
    const workouts = useQuery<WorkoutEvent>(WorkoutEvent);

    return workouts
      .filtered('userId == $0', userId)
      .sorted('workoutDate', true);
  };

  public static getWorkoutsByType = (workoutType: WorkoutType) => {
    const workouts = useQuery<WorkoutEvent>(WorkoutEvent);

    return workouts
      .filtered('workoutType == $0', workoutType)
      .sorted('workoutDate', true);
  };

  public static getWorkoutRecordsInDateInterval = (
    startDate: Date,
    endDate: Date,
    existsWorkoutsResult?: Realm.Results<WorkoutEvent>,
  ) => {
    const workouts = existsWorkoutsResult
      ? existsWorkoutsResult
      : useQuery<WorkoutEvent>(WorkoutEvent);

    return workouts
      .filtered('workoutDate >= $0 && workoutDate =< $1', startDate, endDate)
      .sorted('workoutDate', true);
  };

  public static getWorkoutTypeBestResult = (
    workoutType: WorkoutType,
  ): BestWorkoutResult => {
    const bestResults = useQuery<BestWorkoutResult>(BestWorkoutResult);

    const [bestResult] = Array.from(
      bestResults.filtered('workoutType == $0', workoutType),
    );

    return bestResult;
  };

  public static getGroupedByWorkoutTypeBestResults = (): Record<
    WorkoutType,
    number
  > => {
    const bestResultsList = useQuery<BestWorkoutResult>(BestWorkoutResult);

    return bestResultsList.reduce<Record<WorkoutType, number>>(
      (accum, bestResult) => {
        return {
          ...accum,
          [bestResult.workoutType]: bestResult.reps,
        };
      },
      {
        [WorkoutType.PushUp]: 0,
        [WorkoutType.Squat]: 0,
        [WorkoutType.SitUp]: 0,
      },
    );
  };
}
