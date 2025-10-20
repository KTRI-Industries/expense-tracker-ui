import { Injectable } from '@angular/core';
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
import { RecurrentTransactionActions } from './transactions.actions';
import { PageRecurrentTransactionDto } from '@expense-tracker-ui/shared/api';
import { TransactionsService } from '../transactions.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { ErrorHandlingActions } from '@expense-tracker-ui/shared/error-handling';
import { selectRecurrentTransactions } from './recurrent-transactions.selectors';

@Injectable()
export class RecurrentTransactionsEffects {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store,
    private actions$: Actions,
    private client: TransactionsService,
  ) {}

  retrieveRecurrentTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecurrentTransactionActions.initRecurrentTransactions),
      switchMap(({ pageable }) =>
        this.client.getAllRecurrentTransactions(pageable).pipe(
          map((recurrentTransactions: PageRecurrentTransactionDto) =>
            RecurrentTransactionActions.loadRecurrentTransactionsSuccess({
              recurrentTransactions,
            }),
          ),
          catchError((error) =>
            of(
              RecurrentTransactionActions.loadRecurrentTransactionsFailure({
                error,
              }),
            ),
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
      ofType(RecurrentTransactionActions.loadRecurrentTransaction),
      withLatestFrom(this.store.select(selectRecurrentTransactions)),
      filter(
        ([action, transactions]) =>
          !transactions?.content?.find(
            (t) => t.recurrentTransactionId === action.recurrentTransactionId,
          ),
      ),
      switchMap(([action]) =>
        this.client.getRecurrentTransaction(action.recurrentTransactionId).pipe(
          map((recurrentTransaction) =>
            RecurrentTransactionActions.loadRecurrentTransactionSuccess({
              recurrentTransaction,
            }),
          ),
        ),
      ),
    ),
  );

  createTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecurrentTransactionActions.createNewRecurrentTransaction),
      switchMap(({ recurrentTransactionCommand }) =>
        this.client
          .createRecurrentTransaction(recurrentTransactionCommand)
          .pipe(
            map((recurrentTransaction) =>
              RecurrentTransactionActions.createNewRecurrentTransactionSuccess({
                recurrentTransaction,
              }),
            ),
            tap(() =>
              this.router.navigate([
                'transactions-page',
                'recurrent-transactions',
              ]),
            ),
            tap(() =>
              this.snackBar.open('Recurrent transaction created', 'Close'),
            ),
            catchError((error) =>
              of(
                RecurrentTransactionActions.createNewRecurrentTransactionFailure(
                  {
                    error,
                  },
                ),
              ),
            ),
          ),
      ),
    ),
  );

  openTransactionForm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecurrentTransactionActions.openRecurrentTransactionFrom),
        tap(() =>
          this.router.navigate([
            'transactions-page',
            'recurrent-transactions',
            'new',
          ]),
        ),
      ),
    { dispatch: false },
  );

  openTransactionFormToEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecurrentTransactionActions.editRecurrentTransaction),
        tap(({ recurrentTransactionId }) =>
          this.router.navigate([
            'transactions-page',
            'recurrent-transactions',
            recurrentTransactionId,
          ]),
        ),
      ),
    { dispatch: false },
  );

  deleteTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecurrentTransactionActions.deleteRecurrentTransaction),
      switchMap(({ recurrentTransactionId }) =>
        this.client.deleteRecurrentTransaction(recurrentTransactionId).pipe(
          map(() =>
            RecurrentTransactionActions.deleteRecurrentTransactionSuccess(),
          ),
          tap(() =>
            this.router.navigate([
              'transactions-page',
              'recurrent-transactions',
            ]),
          ),
          tap(() =>
            this.snackBar.open('Recurrent transaction deleted', 'Close'),
          ),
          catchError((error) =>
            of(
              RecurrentTransactionActions.deleteRecurrentTransactionFailure({
                error,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecurrentTransactionActions.updateRecurrentTransaction),
      switchMap(({ updateRecurrentTransactionCommand }) =>
        this.client
          .updateRecurrentTransaction(updateRecurrentTransactionCommand)
          .pipe(
            map((recurrentTransaction) =>
              RecurrentTransactionActions.updateRecurrentTransactionSuccess({
                recurrentTransaction,
              }),
            ),
            tap(() =>
              this.router.navigate([
                'transactions-page',
                'recurrent-transactions',
              ]),
            ),
            tap(() =>
              this.snackBar.open('Recurrent transaction updated', 'Close'),
            ),
            catchError((error) =>
              of(
                RecurrentTransactionActions.updateRecurrentTransactionFailure({
                  error,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  clearError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        RecurrentTransactionActions.createNewRecurrentTransactionSuccess,
        RecurrentTransactionActions.updateRecurrentTransactionSuccess,
        RecurrentTransactionActions.deleteRecurrentTransactionSuccess,
      ),
      map(() => ErrorHandlingActions.clearBackEndError()),
    ),
  );
}
