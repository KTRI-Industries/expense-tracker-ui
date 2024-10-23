import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { transactionsFeature } from './+state/transactions.reducer';
import { TransactionsEffects } from './+state/transactions.effects';
import { TransactionsContainerComponent } from './transactions-container.component';
import { TransactionContainerComponent } from './transaction-container.component';
import { AppGuard } from '@expense-tracker-ui/shared/auth';
import { RecurrentTransactionsContainerComponent } from './recurrent-transactions-container.component';
import { RecurrentTransactionContainerComponent } from './recurrent-transaction-container.component';
import { recurrentTransactionsFeature } from './+state/recurrent-transactions.reducer';
import { RecurrentTransactionsEffects } from './+state/recurrent-transactions.effects';
import { TransactionsPageContainerComponent } from './transactions-page-container.component';

export const transactionsRoutes: Route[] = [
  {
    path: '',
    component: TransactionsPageContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full',
      },
      {
        path: 'transactions',
        component: TransactionsContainerComponent,
        providers: [
          provideState(transactionsFeature),
          provideEffects(TransactionsEffects),
        ],
      },
      {
        path: 'transactions/new',
        component: TransactionContainerComponent,
        providers: [
          provideState(transactionsFeature),
          provideEffects(TransactionsEffects),
        ],
      },

      {
        path: 'transactions/:id',
        component: TransactionContainerComponent,
        providers: [
          provideState(transactionsFeature),
          provideEffects(TransactionsEffects),
        ],
        canActivate: [AppGuard],
      },

      {
        path: 'recurrent-transactions',
        component: RecurrentTransactionsContainerComponent,
        providers: [
          provideState(recurrentTransactionsFeature),
          provideEffects(RecurrentTransactionsEffects),
        ],
      },
      {
        path: 'recurrent-transactions/new',
        component: RecurrentTransactionContainerComponent,
        providers: [
          provideState(recurrentTransactionsFeature),
          provideEffects(RecurrentTransactionsEffects),
        ],
      },
      {
        path: 'recurrent-transactions/:id',
        component: RecurrentTransactionContainerComponent,
        providers: [
          provideState(recurrentTransactionsFeature),
          provideEffects(RecurrentTransactionsEffects),
        ],
        canActivate: [AppGuard],
      },
    ],
  },
];

export const recurrentTransactionsRoutes: Route[] = [
  // order matters, this must be before the :id route
  {
    path: '',
    component: RecurrentTransactionsContainerComponent,
    providers: [
      provideState(recurrentTransactionsFeature),
      provideEffects(RecurrentTransactionsEffects),
    ],
  },
  {
    path: 'new',
    component: RecurrentTransactionContainerComponent,
    providers: [
      provideState(recurrentTransactionsFeature),
      provideEffects(RecurrentTransactionsEffects),
    ],
  },
  {
    path: ':id',
    component: RecurrentTransactionContainerComponent,
    providers: [
      provideState(recurrentTransactionsFeature),
      provideEffects(RecurrentTransactionsEffects),
    ],
    canActivate: [AppGuard],
  },
];
