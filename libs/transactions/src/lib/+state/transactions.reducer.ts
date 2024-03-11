import { createFeature, createReducer, on } from '@ngrx/store';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';
import { TransactionActions } from './transactions.actions';

export const TRANSACTIONS_FEATURE_KEY = 'transactions';

export interface TransactionsState {
  transactions: PageTransactionDto | undefined;
  currentTransaction: TransactionDto | null;
}

export const initialTransactionsState: TransactionsState = {
  transactions: undefined,
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
    on(
      TransactionActions.createNewTransactionSuccess,
      (state, { transaction }) => ({
        ...state,
        currentTransaction: transaction,
        transactions: undefined, // otherwise the list of transactions won't be updated
      }),
    ),
  ),
});
