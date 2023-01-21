import { createSlice } from '@reduxjs/toolkit';

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
}

const initialState: IWorkoutState = {
  workoutState: WorkoutState.Working,
  setNumber: 0,
  reps: 0,
  repsDoneTotal: 0,
  setList: [],
};

export const workoutSlice = createSlice({
  reducers: {
    initWorkout: (state, action) => ({ ...initialState, ...action.payload }),
    setWorkoutState: (state, action) => {
      state.workoutState = action.payload;
    },
    increaseReps: state => {
      state.reps = state.reps + 1;
      state.repsDoneTotal = state.repsDoneTotal + 1;
    },
    increaseSetNumber: state => {
      state.reps = 0;
      state.setNumber = state.setNumber + 1;
    },
    finishSet: state => {
      state.repsDoneTotal =
        state.repsDoneTotal - state.reps + state.setList[state.setNumber];

      state.reps = state.setList[state.setNumber];
    },
  },
  initialState,
  name: '@workoutSlice',
});

export const initWorkout = workoutSlice.actions.initWorkout;
export const increaseReps = workoutSlice.actions.increaseReps;
export const increaseSetNumber = workoutSlice.actions.increaseSetNumber;
export const setWorkoutState = workoutSlice.actions.setWorkoutState;
export const finishSet = workoutSlice.actions.finishSet;

export const workoutSliceReducer = workoutSlice.reducer;
