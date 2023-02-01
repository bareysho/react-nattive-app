import { Realm } from '@realm/react';

import { WorkoutType } from '@src/enums/WorkoutType';

export class BestWorkoutResult extends Realm.Object {
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'BestWorkoutResult',
    primaryKey: '_id',
    type: 'object',
    schemaVersion: 2,
    properties: {
      _id: 'objectId',
      userId: 'string',
      workoutType: 'string',
      reps: 'int',
    },
  };

  _id!: Realm.BSON.ObjectId;

  userId!: string;

  workoutType!: WorkoutType;

  reps!: number;

  // the Task.generate() method creates Task objects with fields with default values
  static generate({
    userId,
    workoutType,
    reps,
  }: {
    userId: string;
    workoutType: WorkoutType;
    reps: number;
  }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      userId,
      workoutType,
      reps,
    };
  }
}
