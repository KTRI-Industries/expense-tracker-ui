import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto } from '@expense-tracker-ui/api';
import { TransactionsService } from '../transactions.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}
}
