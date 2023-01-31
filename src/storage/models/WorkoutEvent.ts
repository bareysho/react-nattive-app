import { Realm } from '@realm/react';

import { WorkoutType } from '@src/enums/WorkoutType';

export class WorkoutEvent extends Realm.Object {
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'WorkoutEvent',
    primaryKey: '_id',
    type: 'object',
    schemaVersion: 2,
    properties: {
      _id: 'objectId',
      userId: 'string',
      sets: 'int[]',
      setsDone: 'int[]',
      workoutType: 'string',
      workoutDate: 'date',
      durationTimeSec: 'int',
    },
  };

  _id!: Realm.BSON.ObjectId;

  userId!: string;

  workoutType!: WorkoutType;

  workoutDate!: Date;

  durationTimeSec!: number;

  sets!: Realm.List<number>;

  setsDone!: Realm.List<number>;

  // the Task.generate() method creates Task objects with fields with default values
  static generate({
    userId,
    sets,
    setsDone,
    workoutType,
    durationTimeSec,
  }: {
    userId: string;
    sets: number[];
    setsDone: number[];
    durationTimeSec: number;
    workoutType: WorkoutType;
  }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      userId,
      sets,
      setsDone,
      workoutType,
      durationTimeSec,
      workoutDate: new Date(),
    };
  }
}
