import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto } from '@expense-tracker-ui/api';
import { TransactionsService } from '../transactions.service';

@Injectable()
export class TransactionsEffects {
  private actions$ = inject(Actions);
  private client = inject(TransactionsService);

  retrieveTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionActions.initTransactions),
      switchMap(() =>
        this.client.getAllTransactions().pipe(
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
}
