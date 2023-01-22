import { Realm } from '@realm/react';

import { WorkoutType } from '@src/enums/WorkoutType';
import {subDays} from "date-fns";

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
      setList: 'int[]',
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

  setList!: Realm.List<number>;

  // the Task.generate() method creates Task objects with fields with default values
  static generate({
    userId,
    setList,
    workoutType,
    durationTimeSec,
  }: {
    userId: string;
    setList: number[];
    durationTimeSec: number;
    workoutType: WorkoutType;
  }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      userId,
      setList,
      workoutType,
      durationTimeSec,
      workoutDate: new Date(),
    };
  }
}
