import { RootState } from '@src/redux/store/store';
import { WorkoutType } from '@src/enums/WorkoutType';
import { IWorkoutState } from '@src/redux/slices/workoutSlice';

type WorkoutSelector = (state: RootState) => IWorkoutState;

export const selectWorkout =
  (workOutType: WorkoutType): WorkoutSelector =>
  (state: RootState): IWorkoutState =>
    state.workouts[workOutType];
