import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TransactionActions } from './transactions.actions';
import { TransactionsServiceService } from '../../../../homepage/src/lib/transactions-service.service';
import { PageTransactionDto } from '@expense-tracker-ui/api';

@Injectable()
export class TransactionsEffects {
  private actions$ = inject(Actions);
  private client = inject(TransactionsServiceService);

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
