import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateTransactionCommand,
  Pageable,
  PageTransactionDto,
  TransactionDto,
  UpdateTransactionCommand,
} from '@expense-tracker-ui/shared/api';

export const TransactionActions = createActionGroup({
  source: 'Transactions',
  events: {
    InitTransactions: props<{ pageable: Pageable }>(),
    'Load Transactions Success': props<{ transactions: PageTransactionDto }>(),
    'Load Transactions Failure': props<{ error: Error }>(),
    'Create New Transaction': props<{
      transaction: CreateTransactionCommand;
    }>(),
    'Create New Transaction Success': props<{ transaction: TransactionDto }>(),
    'Create New Transaction Failure': props<{ error: Error }>(),
    'Open Transaction From': emptyProps(),
    'Edit Transaction': props<{ transactionId: string }>(),
    LoadTransaction: props<{ transactionId: string }>(),
    LoadTransactionSuccess: props<{ transaction: TransactionDto }>(),
    LoadTransactionFailure: props<{ error: Error }>(),
    UpdateTransaction: props<{ transaction: UpdateTransactionCommand }>(),
    'Update Transaction Success': props<{ transaction: TransactionDto }>(),
    'Update Transaction Failure': props<{ error: Error }>(),
    DeleteTransaction: props<{ transactionId: string }>(),
    'Delete Transaction Success': emptyProps(),
    'Delete Transaction Failure': props<{ error: Error }>(),
  },
});
