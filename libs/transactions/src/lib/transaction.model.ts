import {
  CreateRecurrentTransactionCommand,
  CreateTransactionCommand,
  RecurrenceFrequency,
} from '@expense-tracker-ui/shared/api';

/**
 * The chips component works only with strings, so to keep things simple
 * we will use a custom type for the model of the formly form
 * which is the original CreateTransactionCommand with the category field as a string array.
 */
export type CreateTransactionCommandUi = Omit<
  CreateTransactionCommand,
  'categories'
> & {
  categories: string[] | undefined;
  txType: 'EXPENSE' | 'INCOME';
  txId?: string;
};

export type CreateRecurrentTransactionCommandUi = Omit<
  CreateRecurrentTransactionCommand,
  'categories'
> & {
  categories: string[] | undefined;
  txType: 'EXPENSE' | 'INCOME';
  recurrentTxId?: string;
};

export const recurrenceFrequencyLabels: Record<RecurrenceFrequency, string> = {
  DAILY: 'Daily',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};
