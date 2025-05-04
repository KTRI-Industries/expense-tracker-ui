import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateRecurrentTransactionCommand,
  CreateTransactionCommand,
  Pageable,
  PageRecurrentTransactionDto,
  PageTransactionDto,
  RecurrentTransactionDto,
  TransactionDto,
  UpdateRecurrentTransactionCommand,
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

    'Open Import Transactions From': emptyProps(),
    ImportTransactions: props<{ fileContent: File }>(),
    'Import Transactions Success': emptyProps(),
    'Import Transactions Failure': props<{ error: Error }>(),
  },
});

export const RecurrentTransactionActions = createActionGroup({
  source: 'RecurrentTransactions',
  events: {
    InitRecurrentTransactions: props<{ pageable: Pageable }>(),
    'Load Recurrent Transactions Success': props<{
      recurrentTransactions: PageRecurrentTransactionDto;
    }>(),
    'Load Recurrent Transactions Failure': props<{ error: Error }>(),
    'Create New Recurrent Transaction': props<{
      recurrentTransactionCommand: CreateRecurrentTransactionCommand;
    }>(),
    'Create New Recurrent Transaction Success': props<{
      recurrentTransaction: RecurrentTransactionDto;
    }>(),
    'Create New Recurrent Transaction Failure': props<{ error: Error }>(),
    'Open Recurrent Transaction From': emptyProps(),
    'Edit Recurrent Transaction': props<{ recurrentTransactionId: string }>(),
    LoadRecurrentTransaction: props<{ recurrentTransactionId: string }>(),
    LoadRecurrentTransactionSuccess: props<{
      recurrentTransaction: RecurrentTransactionDto;
    }>(),
    LoadRecurrentTransactionFailure: props<{ error: Error }>(),
    UpdateRecurrentTransaction: props<{
      updateRecurrentTransactionCommand: UpdateRecurrentTransactionCommand;
    }>(),
    'Update Recurrent Transaction Success': props<{
      recurrentTransaction: RecurrentTransactionDto;
    }>(),
    'Update Recurrent Transaction Failure': props<{ error: Error }>(),
    DeleteRecurrentTransaction: props<{ recurrentTransactionId: string }>(),
    'Delete Recurrent Transaction Success': emptyProps(),
    'Delete Recurrent Transaction Failure': props<{ error: Error }>(),
  },
});
