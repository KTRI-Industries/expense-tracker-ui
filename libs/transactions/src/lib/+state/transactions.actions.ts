import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';

export const TransactionActions = createActionGroup({
  source: 'Transactions',
  events: {
    InitTransactions: emptyProps(),
    'Load Transactions Success': props<{ transactions: PageTransactionDto }>(),
    'Load Transactions Failure': props<{ error: any }>(),
    'Create New Transaction': emptyProps(),
    'Create New Transaction Success': props<{ transaction: TransactionDto }>(),
    'Create New Transaction Failure': props<{ error: any }>(),
  },
});
