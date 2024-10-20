import { recurrentTransactionsFeature } from './recurrent-transactions.reducer';

export const {
  selectRecurrentTransactions,
  selectCurrentRecurrentTransaction,
  selectAugmentedRecurrentTransactions,
  selectSelectedTransactionId,
} = recurrentTransactionsFeature;
