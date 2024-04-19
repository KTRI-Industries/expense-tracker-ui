import { transactionsFeature } from './transactions.reducer';

export const {
  selectTransactions,
  selectCurrentTransaction,
  selectAugmentedTransactions,
} = transactionsFeature;
