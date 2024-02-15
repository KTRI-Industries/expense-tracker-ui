import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PageTransactionDto } from '@expense-tracker-ui/api';

export const TransactionActions = createActionGroup({
  source: 'Transactions',
  events: {
    InitTransactions: emptyProps(),
    'Load Transactions Success': props<{ transactions: PageTransactionDto }>(),
    'Load Transactions Failure': props<{ error: any }>(),
  },
});
