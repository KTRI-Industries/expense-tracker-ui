import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as HomepageActions from './homepage.actions';
import { HomepageEntity } from './homepage.models';

export const HOMEPAGE_FEATURE_KEY = 'homepage';

export interface HomepageState extends EntityState<HomepageEntity> {
  selectedId?: string | number; // which Homepage record has been selected
  loaded: boolean; // has the Homepage list been loaded
  error?: Error | string | null; // last known error (if any)
}

export interface HomepagePartialState {
  readonly [HOMEPAGE_FEATURE_KEY]: HomepageState;
}

export const homepageAdapter: EntityAdapter<HomepageEntity> =
  createEntityAdapter<HomepageEntity>();

export const initialHomepageState: HomepageState =
  homepageAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialHomepageState,
  on(HomepageActions.initHomepage, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(HomepageActions.loadHomepageSuccess, (state, { homepage }) =>
    homepageAdapter.setAll(homepage, { ...state, loaded: true }),
  ),
  on(HomepageActions.loadHomepageFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);

export function homepageReducer(
  state: HomepageState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
