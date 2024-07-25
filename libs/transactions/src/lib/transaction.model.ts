import {
  Category,
  CreateTransactionCommand,
} from '@expense-tracker-ui/shared/api';

export const categoryLabels: Record<Category, string> = {
  BILL: 'bills',
  ENTERTAINMENT: 'entertainment',
  GIFTS: 'gifts',
  GROCERIES: 'groceries',
  OTHER: 'other',
  RESTAURANT: 'restaurant',
  RENT: 'rent',
  SALARY: 'salary',
  SPORT: 'sport',
  TAXES: 'taxes',
  TRAVEL: 'travel',
};
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
