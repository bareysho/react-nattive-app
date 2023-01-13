import { createSlice } from '@reduxjs/toolkit';

export interface IUserSettingState {
  isChangePasswordLoading: boolean;
  isChangeEmailLoading: boolean;
}

const initialState: IUserSettingState = {
  isChangePasswordLoading: false,
  isChangeEmailLoading: false,
};

export const userSettingsSlice = createSlice({
  reducers: {
    setChangeEmailLoading: (state, action) => {
      state.isChangeEmailLoading = action.payload;
    },
    setChangePasswordLoading: (state, action) => {
      state.isChangePasswordLoading = action.payload;
    },
  },
  initialState,
  name: '@userSettings',
});

export const setChangeEmailLoading =
  userSettingsSlice.actions.setChangeEmailLoading;

export const setChangePasswordLoading =
  userSettingsSlice.actions.setChangePasswordLoading;

export const userSettingReducer = userSettingsSlice.reducer;
