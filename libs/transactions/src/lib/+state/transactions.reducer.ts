import { createFeature, createReducer, on } from '@ngrx/store';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';
import { TransactionActions } from './transactions.actions';

export const TRANSACTIONS_FEATURE_KEY = 'transactions';

export interface TransactionsState {
  transactions: PageTransactionDto | null;
  currentTransaction: TransactionDto | null;
}

export const initialTransactionsState: TransactionsState = {
  transactions: null,
  currentTransaction: null,
};

export const transactionsFeature = createFeature({
  name: TRANSACTIONS_FEATURE_KEY,
  reducer: createReducer(
    initialTransactionsState,
    on(
      TransactionActions.loadTransactionsSuccess,
      (state, { transactions }) => ({
        ...state,
        transactions,
      }),
    ),
  ),
});
