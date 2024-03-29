import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { transactionsFeature } from './+state/transactions.reducer';
import { TransactionsEffects } from './+state/transactions.effects';
import { TransactionsContainerComponent } from './transactions-container.component';
import { TransactionContainerComponent } from './transaction-container.component';
import { AppGuard } from '@expense-tracker-ui/shared/auth';

export const transactionsRoutes: Route[] = [
  {
    path: '',
    component: TransactionsContainerComponent,
    providers: [
      provideState(transactionsFeature),
      provideEffects(TransactionsEffects),
    ],
  },
  {
    path: 'new',
    component: TransactionContainerComponent,
    providers: [
      provideState(transactionsFeature),
      provideEffects(TransactionsEffects),
    ],
  },
  {
    path: ':id',
    component: TransactionContainerComponent,
    providers: [
      provideState(transactionsFeature),
      provideEffects(TransactionsEffects),
    ],
    canActivate: [AppGuard],
  },
];
