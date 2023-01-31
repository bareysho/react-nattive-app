import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WorkoutType } from '@src/enums/WorkoutType';

export enum WorkoutState {
  Working,
  Pause,
  Finished,
}

export interface IWorkoutState {
  repsDone: number;
  repsDoneTotal: number;
  sets: number[];
  setsDone: number[];
  workoutLevel: number;
  currentSetIndex: number;
  workoutState: WorkoutState;
}

export interface IWorkoutsState extends Record<WorkoutType, IWorkoutState> {}

const initialWorkoutState: IWorkoutState = {
  sets: [],
  setsDone: [],
  repsDone: 0,
  repsDoneTotal: 0,
  currentSetIndex: 0,
  workoutLevel: 0,
  workoutState: WorkoutState.Working,
};

const initialState: IWorkoutsState = {
  [WorkoutType.PushUp]: initialWorkoutState,
  [WorkoutType.SitUp]: initialWorkoutState,
  [WorkoutType.Squat]: initialWorkoutState,
};

export const workoutSlice = createSlice({
  reducers: {
    initializeWorkout: (
      state: IWorkoutsState,
      action: PayloadAction<
        { workoutType: WorkoutType } & Partial<IWorkoutState>
      >,
    ) => {
      const { workoutType, ...payload } = action.payload;

      const { workoutLevel } = state[workoutType];

      state[workoutType] = { ...initialWorkoutState, ...payload, workoutLevel };
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

      const currentWorkoutState = state[workoutType];

      const repsInCurrentSet =
        currentWorkoutState.sets[currentWorkoutState.currentSetIndex];

      const increasedRepsDone = currentWorkoutState.repsDone + 1;

      if (repsInCurrentSet === increasedRepsDone) {
        currentWorkoutState.setsDone = [
          ...currentWorkoutState.setsDone,
          increasedRepsDone,
        ];
      }

      currentWorkoutState.repsDone = increasedRepsDone;
      currentWorkoutState.repsDoneTotal = currentWorkoutState.repsDoneTotal + 1;
    },
    increaseSetNumber: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      const currentWorkoutState = state[workoutType];

      currentWorkoutState.currentSetIndex =
        currentWorkoutState.currentSetIndex + 1;

      currentWorkoutState.repsDone = 0;
    },
    skipCurrentSet: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      const currentWorkoutState = state[workoutType];

      currentWorkoutState.setsDone = [
        ...currentWorkoutState.setsDone,
        currentWorkoutState.repsDone,
      ];
    },
    completeCurrentSet: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      const currentWorkoutState = state[workoutType];

      const repsInCurrentSet =
        currentWorkoutState.sets[currentWorkoutState.currentSetIndex];

      const undoneRepsInCurrentSet =
        repsInCurrentSet - currentWorkoutState.repsDone;

      currentWorkoutState.repsDoneTotal =
        currentWorkoutState.repsDoneTotal + undoneRepsInCurrentSet;

      state[workoutType].setsDone = [
        ...state[workoutType].setsDone,
        repsInCurrentSet,
      ];
    },
    exitWorkout: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      const currentWorkoutState = state[workoutType];

      currentWorkoutState.setsDone[currentWorkoutState.currentSetIndex] =
        currentWorkoutState.repsDone;

      currentWorkoutState.setsDone = currentWorkoutState.sets.map(
        (setValue, index) => {
          if (typeof currentWorkoutState.setsDone[index] === 'number') {
            return currentWorkoutState.setsDone[index];
          }

          return 0;
        },
      );

      currentWorkoutState.workoutState = WorkoutState.Finished;
    },
    completeWorkout: (
      state: IWorkoutsState,
      action: PayloadAction<{ workoutType: WorkoutType }>,
    ) => {
      const { workoutType } = action.payload;

      const currentWorkoutState = state[workoutType];

      currentWorkoutState.setsDone = currentWorkoutState.sets;

      currentWorkoutState.workoutState = WorkoutState.Finished;
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

export const initializeWorkout = workoutSlice.actions.initializeWorkout;
export const increaseReps = workoutSlice.actions.increaseReps;
export const increaseSetNumber = workoutSlice.actions.increaseSetNumber;
export const setWorkoutState = workoutSlice.actions.setWorkoutState;
export const completeCurrentSet = workoutSlice.actions.completeCurrentSet;
export const skipCurrentSet = workoutSlice.actions.skipCurrentSet;
export const setWorkoutLevel = workoutSlice.actions.setWorkoutLevel;
export const exitWorkout = workoutSlice.actions.exitWorkout;
export const completeWorkout = workoutSlice.actions.completeWorkout;

export const workoutSliceReducer = workoutSlice.reducer;
