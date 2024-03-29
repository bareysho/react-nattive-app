// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createRealmContext, Realm } from '@realm/react';

import { WorkoutEvent } from './models/WorkoutEvent';
import { BestWorkoutResult } from './models/BestWorkoutResult';

// Increase for migration
const SCHEMA_VERSION = 0;

// Uncomment for migration

// Realm.open({
//   schema: [WorkoutEvent],
//   schemaVersion: SCHEMA_VERSION,
//   onMigration: (oldRealm, newRealm) => {
//     if (oldRealm.schemaVersion < SCHEMA_VERSION) {
//       const oldObjects = oldRealm.objects<WorkoutEvent>('WorkoutEvent');
//       const newObjects = newRealm.objects<WorkoutEvent>('WorkoutEvent');
//       // loop through all objects and set the fullName property in the new schema
//       for (const objectIndex in oldObjects) {
//         const oldObject = oldObjects[objectIndex];
//         const newObject = newObjects[objectIndex];
//
//       }
//     }
//   },
// });

const config = {
  schema: [WorkoutEvent, BestWorkoutResult],
  schemaVersion: SCHEMA_VERSION,
};

export default createRealmContext(config);
