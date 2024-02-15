import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { transactionsFeature } from './+state/transactions.reducer';
import { TransactionsEffects } from './+state/transactions.effects';
import { TransactionsContainerComponent } from './transactions/transactions-container.component';

export const transactionsRoutes: Route[] = [
  {
    path: '',
    component: TransactionsContainerComponent,
    providers: [
      provideState(transactionsFeature),
      provideEffects(TransactionsEffects),
    ],
  },
];
