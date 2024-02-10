import { Route } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromTransactions from './+state/transactions.reducer';
import { TransactionsEffects } from './+state/transactions.effects';

export const transactionsRoutes: Route[] = [
  {
    path: '',
    component: TransactionsComponent,
    providers: [
      provideState(
        fromTransactions.TRANSACTIONS_FEATURE_KEY,
        fromTransactions.transactionsReducer,
      ),
      provideEffects(TransactionsEffects),
    ],
  },
];
