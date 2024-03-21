import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';
import { TransactionActions } from './transactions.actions';

export const TRANSACTIONS_FEATURE_KEY = 'transactions';

export interface TransactionsState {
  transactions: PageTransactionDto | undefined;
  currentTransaction: TransactionDto | null;
  selectedTransactionId: string | null;
}

export const initialTransactionsState: TransactionsState = {
  transactions: undefined,
  currentTransaction: null,
  selectedTransactionId: null,
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
    on(TransactionActions.editTransaction, (state, { transactionId }) => ({
      ...state,
      selectedTransactionId: transactionId,
    })),
  ),
  extraSelectors: ({ selectTransactions, selectSelectedTransactionId }) => ({
    selectCurrentTransaction: createSelector(
      selectTransactions,
      selectSelectedTransactionId,
      (transactions, selectedTransactionId) =>
        transactions?.content?.find(
          (t) => t.transactionId === selectedTransactionId,
        ),
    ),
  }),
});
