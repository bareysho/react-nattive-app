import { ImageAppName } from '@src/components/Image/Image';
import { WorkoutType } from '@src/enums/WorkoutType';

export const IMAGE_BY_WORKOUT_MAPPER: Record<WorkoutType, ImageAppName> = {
  [WorkoutType.PushUp]: ImageAppName.PushUp,
  [WorkoutType.Squat]: ImageAppName.Squat,
  [WorkoutType.SitUp]: ImageAppName.SitUp,
};
