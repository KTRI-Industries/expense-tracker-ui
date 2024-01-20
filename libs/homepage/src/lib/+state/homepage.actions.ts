import { createAction, props } from '@ngrx/store';
import { HomepageEntity } from './homepage.models';

export const initHomepage = createAction('[Homepage Page] Init');

export const loadHomepageSuccess = createAction(
  '[Homepage/API] Load Homepage Success',
  props<{ homepage: HomepageEntity[] }>(),
);

export const loadHomepageFailure = createAction(
  '[Homepage/API] Load Homepage Failure',
  props<{ error: any }>(),
);
