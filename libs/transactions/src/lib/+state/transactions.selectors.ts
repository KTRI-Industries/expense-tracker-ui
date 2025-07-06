import { transactionsFeature } from './transactions.reducer';

export const {
  selectTransactions,
  selectCurrentTransaction,
  selectAugmentedTransactions,
  selectFilterRange,
} = transactionsFeature;
