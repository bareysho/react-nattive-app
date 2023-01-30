import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WorkoutType } from '@src/enums/WorkoutType';

export enum WorkoutState {
  Ready,
  Working,
  Pause,
  Finished,
}

export interface IWorkoutState {
  workoutState: WorkoutState;
  setNumber: number;
  reps: number;
  repsDoneTotal: number;
  setList: number[];
  workoutLevel: number;
}

export interface IWorkoutsState extends Record<WorkoutType, IWorkoutState> {}

const initialWorkoutState: IWorkoutState = {
  workoutState: WorkoutState.Working,
  setNumber: 0,
  reps: 0,
  repsDoneTotal: 0,
  setList: [],
  workoutLevel: 0,
};

const initialState: IWorkoutsState = {
  [WorkoutType.PushUp]: initialWorkoutState,
  [WorkoutType.SitUp]: initialWorkoutState,
  [WorkoutType.Squat]: initialWorkoutState,
};

export const workoutSlice = createSlice({
  reducers: {
    initWorkout: (
      state: IWorkoutsState,
      action: PayloadAction<
        { workoutType: WorkoutType } & Partial<IWorkoutState>
      >,
    ) => {
      const { workoutType, ...payload } = action.payload;

      return {
        ...state,
        [workoutType]: {
          ...initialWorkoutState,
          ...payload,
          workoutLevel: state[workoutType].workoutLevel,
        },
      };
    },
    setWorkoutState: (
      state: IWorkoutsState,
      action: PayloadAction<{
        workoutType: WorkoutType;
        workoutState: WorkoutState;
      }>,
    ) => {
      const { workoutType, workoutState } = action.payload;

      state[workoutType].workoutState = workoutState;
    },
    increaseReps: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      state[workoutType].reps = state[workoutType].reps + 1;
      state[workoutType].repsDoneTotal = state[workoutType].repsDoneTotal + 1;
    },
    increaseSetNumber: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      state[workoutType].reps = 0;
      state[workoutType].setNumber = state[workoutType].setNumber + 1;
    },
    finishSet: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      state[workoutType].repsDoneTotal =
        state[workoutType].repsDoneTotal -
        state[workoutType].reps +
        state[workoutType].setList[state[workoutType].setNumber];

      state[workoutType].reps =
        state[workoutType].setList[state[workoutType].setNumber];
    },
    setWorkoutLevel: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType; level: number }>,
    ) => {
      const { workoutType, level } = action.payload;

      state[workoutType].workoutLevel = level;
    },
  },
  initialState,
  name: '@workoutsSlice',
});

export const initWorkout = workoutSlice.actions.initWorkout;
export const increaseReps = workoutSlice.actions.increaseReps;
export const increaseSetNumber = workoutSlice.actions.increaseSetNumber;
export const setWorkoutState = workoutSlice.actions.setWorkoutState;
export const finishSet = workoutSlice.actions.finishSet;
export const setWorkoutLevel = workoutSlice.actions.setWorkoutLevel;

export const workoutSliceReducer = workoutSlice.reducer;
