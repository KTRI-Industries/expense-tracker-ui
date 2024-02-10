import { createAction, props } from '@ngrx/store';
import { TransactionsEntity } from './transactions.models';

export const initTransactions = createAction('[Transactions Page] Init');

export const loadTransactionsSuccess = createAction(
  '[Transactions/API] Load Transactions Success',
  props<{ transactions: TransactionsEntity[] }>(),
);

export const loadTransactionsFailure = createAction(
  '[Transactions/API] Load Transactions Failure',
  props<{ error: any }>(),
);
