import { WorkoutEvent } from '@src/storage/models/WorkoutEvent';
import { WorkoutType } from '@src/enums/WorkoutType';

export const groupWorkoutsByType = (workoutsToday: WorkoutEvent[]) =>
  workoutsToday.reduce<Record<WorkoutType, WorkoutEvent[]>>(
    (accum, item) => ({
      ...accum,
      [item.workoutType]: [...accum[item.workoutType], item],
    }),
    {
      [WorkoutType.SitUp]: [],
      [WorkoutType.Squat]: [],
      [WorkoutType.PushUp]: [],
    },
  );

export const getArraySum = (array: number[]) =>
  array.reduce((accum, value) => accum + value, 0);

export const getWorkoutsTotalReps = (workouts: WorkoutEvent[]) =>
  getArraySum(workouts.map(workout => workout.setsDone.sum()));

export const getGroupedWorkoutsRepsTotal = (workoutsToday: WorkoutEvent[]) =>
  Object.entries(groupWorkoutsByType(workoutsToday)).reduce<
    Record<WorkoutType, number>
  >(
    (accum, [workoutType, workoutList]) => ({
      ...accum,
      [workoutType]: getWorkoutsTotalReps(workoutList),
    }),
    {
      [WorkoutType.SitUp]: 0,
      [WorkoutType.Squat]: 0,
      [WorkoutType.PushUp]: 0,
    },
  );
