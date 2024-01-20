import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  HOMEPAGE_FEATURE_KEY,
  homepageAdapter,
  HomepageState,
} from './homepage.reducer';

// Lookup the 'Homepage' feature state managed by NgRx
export const selectHomepageState =
  createFeatureSelector<HomepageState>(HOMEPAGE_FEATURE_KEY);

const { selectAll, selectEntities } = homepageAdapter.getSelectors();

export const selectHomepageLoaded = createSelector(
  selectHomepageState,
  (state: HomepageState) => state.loaded,
);

export const selectHomepageError = createSelector(
  selectHomepageState,
  (state: HomepageState) => state.error,
);

export const selectAllHomepage = createSelector(
  selectHomepageState,
  (state: HomepageState) => selectAll(state),
);

export const selectHomepageEntities = createSelector(
  selectHomepageState,
  (state: HomepageState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectHomepageState,
  (state: HomepageState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectHomepageEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
