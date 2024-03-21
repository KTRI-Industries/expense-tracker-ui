import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';
import { TransactionActions } from './transactions.actions';

export const TRANSACTIONS_FEATURE_KEY = 'transactions';

export interface TransactionsState {
  transactions: PageTransactionDto | undefined;
  selectedTransactionId: string | null;
}

export const initialTransactionsState: TransactionsState = {
  transactions: undefined,
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
    on(TransactionActions.openTransactionFrom, (state) => ({
      ...state,
      selectedTransactionId: null, // otherwise the form will be prefilled with the last selected transaction
    })),
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
    on(TransactionActions.loadTransaction, (state, { transactionId }) => ({
      ...state,
      selectedTransactionId: transactionId,
    })),
    on(TransactionActions.loadTransactionSuccess, (state, { transaction }) => ({
      ...state,
      transactions: {
        ...state.transactions,
        content: [...(state?.transactions?.content ?? []), transaction],
      },
    })),
  ),
  extraSelectors: ({ selectTransactions, selectSelectedTransactionId }) => ({
    selectCurrentTransaction: createSelector(
      selectTransactions,
      selectSelectedTransactionId,
      (transactions, selectedTransactionId) => {
        if (selectedTransactionId === null) {
          return {} as TransactionDto; // this is only needed for the case of new transaction where we do not have a selected tx id but we still want to render the component. so we return an empty object instead of undefined...
        }
        return transactions?.content?.find(
          (t) => t.transactionId === selectedTransactionId,
        );
      },
    ),
  }),
});
