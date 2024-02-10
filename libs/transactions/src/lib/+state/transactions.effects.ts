import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap } from 'rxjs';
import * as TransactionsActions from './transactions.actions';

@Injectable()
export class TransactionsEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionsActions.initTransactions),
      switchMap(() =>
        of(TransactionsActions.loadTransactionsSuccess({ transactions: [] })),
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(TransactionsActions.loadTransactionsFailure({ error }));
      }),
    ),
  );
}
