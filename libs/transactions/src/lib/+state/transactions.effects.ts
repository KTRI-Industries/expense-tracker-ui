import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto } from '@expense-tracker-ui/api';
import { TransactionsService } from '../transactions.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectTransactions } from './transactions.selectors';

@Injectable()
export class TransactionsEffects {
  private actions$ = inject(Actions);
  private client = inject(TransactionsService);

  retrieveTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.initTransactions),
      switchMap(({ pageable }) =>
        this.client.getAllTransactions(pageable).pipe(
          map((transactions: PageTransactionDto) =>
            TransactionActions.loadTransactionsSuccess({ transactions }),
          ),
          catchError((error) =>
            of(TransactionActions.loadTransactionsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  /**
   * Load a transaction if it is not already loaded. (case where user navigates directly to transaction with url).
   * Filter checks if the transaction is already loaded.
   *
   */
  loadTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.loadTransaction),
      withLatestFrom(this.store.select(selectTransactions)),
      filter(
        ([action, transactions]) =>
          !transactions?.content?.find(
            (t) => t.transactionId === action.transactionId,
          ),
      ),
      switchMap(([action, transactions]) =>
        this.client
          .getTransaction(action.transactionId)
          .pipe(
            map((transaction) =>
              TransactionActions.loadTransactionSuccess({ transaction }),
            ),
          ),
      ),
    ),
  );

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.createNewTransaction),
      switchMap(({ transaction }) =>
        this.client.createTransaction(transaction).pipe(
          map((transaction) =>
            TransactionActions.createNewTransactionSuccess({ transaction }),
          ),
          tap(() => this.router.navigate(['transactions'])),
          tap(() => this.snackBar.open('Transaction created', 'Close')),
          catchError((error) =>
            of(TransactionActions.createNewTransactionFailure({ error })),
          ),
        ),
      ),
    ),
  );

  openTransactionForm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TransactionActions.openTransactionFrom),
        tap(() => this.router.navigate(['transactions', 'new'])),
      ),
    { dispatch: false },
  );

  openTransactionFormToEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TransactionActions.editTransaction),
        tap(({ transactionId }) =>
          this.router.navigate(['transactions', transactionId]),
        ),
      ),
    { dispatch: false },
  );

  deleteTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.deleteTransaction),
      switchMap(({ transactionId }) =>
        this.client.deleteTransaction(transactionId).pipe(
          map(() => TransactionActions.deleteTransactionSuccess()),
          tap(() => this.router.navigate(['transactions'])),
          tap(() => this.snackBar.open('Transaction deleted', 'Close')),
          catchError((error) =>
            of(TransactionActions.deleteTransactionFailure({ error })),
          ),
        ),
      ),
    ),
  );

  updateTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.updateTransaction),
      switchMap(({ transaction }) =>
        this.client.updateTransaction(transaction).pipe(
          map((transaction) =>
            TransactionActions.updateTransactionSuccess({ transaction }),
          ),
          tap(() => this.router.navigate(['transactions'])),
          tap(() => this.snackBar.open('Transaction updated', 'Close')),
          catchError((error) =>
            of(TransactionActions.updateTransactionFailure({ error })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store,
  ) {}
}
