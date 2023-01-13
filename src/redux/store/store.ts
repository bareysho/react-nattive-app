import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { authReducer, userSettingReducer } from '@src/redux/slices';
import { baseQueryApi } from '@src/api/queryAPI';

export const store = configureStore({
  reducer: {
    [baseQueryApi.reducerPath]: baseQueryApi.reducer,
    auth: authReducer,
    userSettings: userSettingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseQueryApi.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
