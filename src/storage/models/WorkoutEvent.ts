import { Realm } from '@realm/react';

export class WorkoutEvent extends Realm.Object {
  _id!: Realm.BSON.ObjectId;

  userId!: string;

  workoutDate!: Date;

  setList!: Realm.List<number>;

  // the Task.generate() method creates Task objects with fields with default values
  static generate({ userId, setList }: { userId: string; setList: number[] }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      userId,
      setList,
      workoutDate: new Date(),
    };
  }

  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
    name: 'Task',
    primaryKey: '_id',
    type: 'object',
    properties: {
      _id: 'objectId',
      userId: 'string',
      setList: 'string[]',
      workoutDate: 'date',
    },
  };
}
