import { createRealmContext } from '@realm/react';

import { WorkoutEvent } from './models/WorkoutEvent';

const config = {
  schema: [WorkoutEvent],
};

export default createRealmContext(config);
