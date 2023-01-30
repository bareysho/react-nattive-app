import { ImageAppName } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';

import {
  PUSH_UP_WORKOUT_LEVEL,
  SIT_UP_WORKOUT_LEVEL,
  SQUAT_WORKOUT_LEVEL,
} from './asyncStorage';

export const IMAGE_BY_WORKOUT_MAPPER: Record<WorkoutType, ImageAppName> = {
  [WorkoutType.PushUp]: ImageAppName.PushUp,
  [WorkoutType.Squat]: ImageAppName.Squat,
  [WorkoutType.SitUp]: ImageAppName.SitUp,
};

export const WORKOUT_PRIMARY_COLOR = {
  [WorkoutType.Squat]: '#67e8f9',
  [WorkoutType.PushUp]: '#ffe502',
  [WorkoutType.SitUp]: '#86efac',
};

export const WORKOUT_SECONDARY_COLOR = {
  [WorkoutType.Squat]: '#0bd5e8',
  [WorkoutType.PushUp]: '#dcc40c',
  [WorkoutType.SitUp]: '#18c055',
};

export const WORKOUT_LEVEL_ASYNC_STORAGE_KEY = {
  [WorkoutType.Squat]: SQUAT_WORKOUT_LEVEL,
  [WorkoutType.PushUp]: PUSH_UP_WORKOUT_LEVEL,
  [WorkoutType.SitUp]: SIT_UP_WORKOUT_LEVEL,
};

export const PUSH_UP_WORKOUT_LEVELS: Record<
  number,
  { level: string; set: number[]; restSec: number }
> = {
  1: { level: '1', set: [16, 15, 12, 18], restSec: 60 },
  2: { level: '2', set: [18, 17, 15, 21], restSec: 40 },
  3: { level: '3', set: [21, 19, 18, 24], restSec: 40 },
  4: { level: '4', set: [24, 21, 21, 27], restSec: 30 },
  5: { level: '5', set: [27, 23, 24, 30], restSec: 30 },
};

export const WORKOUT_TITLE_MAPPER: Record<WorkoutType, string> = {
  [WorkoutType.PushUp]: 'Отжимания',
  [WorkoutType.Squat]: 'Скручивания',
  [WorkoutType.SitUp]: 'Приседания',
};

export const WORKOUT_SCREEN_MAPPER = {
  [WorkoutType.PushUp]: 'PushUpsWorkoutScreen',
  [WorkoutType.Squat]: 'SquatWorkoutScreen',
  [WorkoutType.SitUp]: 'SitUpWorkoutScreen',
};
