import { ImageAppName } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';
import { LIGHT_PRIMARY_COLORS } from '@src/components/UI/components/ThemeProvider/lightPrimary';

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
  [WorkoutType.Squat]: '#06b6d4',
  [WorkoutType.SitUp]: '#22c55e',
  [WorkoutType.PushUp]: LIGHT_PRIMARY_COLORS.primary,
};

export const WORKOUT_HEADER_SECONDARY_COLOR = {
  [WorkoutType.Squat]: '#67e8f9',
  [WorkoutType.SitUp]: '#86efac',
  [WorkoutType.PushUp]: '#ffee9c',
};

export const WORKOUT_SECONDARY_COLOR = {
  [WorkoutType.Squat]: '#0891b2',
  [WorkoutType.SitUp]: '#16a34a',
  [WorkoutType.PushUp]: LIGHT_PRIMARY_COLORS.primaryPressed,
};

export const WORKOUT_LEVEL_ASYNC_STORAGE_KEY = {
  [WorkoutType.Squat]: SQUAT_WORKOUT_LEVEL,
  [WorkoutType.PushUp]: PUSH_UP_WORKOUT_LEVEL,
  [WorkoutType.SitUp]: SIT_UP_WORKOUT_LEVEL,
};

export const PUSH_UP_WORKOUT_LEVELS: Record<
  number,
  { level: string; sets: number[]; restSec: number }
> = {
  1: { level: '1', sets: [16, 15, 12, 18], restSec: 60 },
  2: { level: '2', sets: [18, 17, 15, 21], restSec: 40 },
  3: { level: '3', sets: [21, 19, 18, 24], restSec: 40 },
  4: { level: '4', sets: [24, 21, 21, 27], restSec: 30 },
  5: { level: '5', sets: [27, 23, 24, 30], restSec: 30 },
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
