import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateTransactionCommand,
  PageTransactionDto,
  TransactionDto,
} from '@expense-tracker-ui/api';

export const TransactionActions = createActionGroup({
  source: 'Transactions',
  events: {
    InitTransactions: emptyProps(),
    'Load Transactions Success': props<{ transactions: PageTransactionDto }>(),
    'Load Transactions Failure': props<{ error: Error }>(),
    'Create New Transaction': props<{
      transaction: CreateTransactionCommand;
    }>(),
    'Create New Transaction Success': props<{ transaction: TransactionDto }>(),
    'Create New Transaction Failure': props<{ error: Error }>(),
    'Open Transaction From': emptyProps(),
  },
});
