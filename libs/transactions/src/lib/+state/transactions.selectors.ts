import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TRANSACTIONS_FEATURE_KEY,
  transactionsAdapter,
  TransactionsState,
} from './transactions.reducer';

// Lookup the 'Transactions' feature state managed by NgRx
export const selectTransactionsState = createFeatureSelector<TransactionsState>(
  TRANSACTIONS_FEATURE_KEY,
);

const { selectAll, selectEntities } = transactionsAdapter.getSelectors();

export const selectTransactionsLoaded = createSelector(
  selectTransactionsState,
  (state: TransactionsState) => state.loaded,
);

export const selectTransactionsError = createSelector(
  selectTransactionsState,
  (state: TransactionsState) => state.error,
);

export const selectAllTransactions = createSelector(
  selectTransactionsState,
  (state: TransactionsState) => selectAll(state),
);

export const selectTransactionsEntities = createSelector(
  selectTransactionsState,
  (state: TransactionsState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectTransactionsState,
  (state: TransactionsState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectTransactionsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
