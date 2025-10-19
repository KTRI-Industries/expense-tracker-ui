import { featureFlagsFeature } from './feature-flags.reducer';
import { createSelector } from '@ngrx/store';

export const { selectFlags, selectLoaded } = featureFlagsFeature;

export const selectImportTransactionsEnabled = createSelector(
  selectFlags,
  (flags) => flags.importTransactions ?? false,
);
