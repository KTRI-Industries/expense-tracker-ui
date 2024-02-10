import { Route } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';

export const transactionsRoutes: Route[] = [
  { path: '', component: TransactionsComponent },
];
