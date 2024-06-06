import { createFeature, createReducer } from '@ngrx/store';

export const USER_FEATURE_KEY = 'user';

export interface UserState {}

export const initialUserState: UserState = {};

export const userFeature = createFeature({
  name: USER_FEATURE_KEY,
  reducer: createReducer(initialUserState),
});
