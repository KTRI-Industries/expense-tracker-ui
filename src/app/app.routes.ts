import { Route } from '@angular/router';
import { AppGuard } from '@expense-tracker-ui/shared/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@expense-tracker-ui/homepage').then((m) => m.homepageRoutes),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('@expense-tracker-ui/transactions').then(
        (m) => m.transactionsRoutes,
      ),
    canActivate: [AppGuard],
    data: {
      roles: ['users'],
    },
  },
  {
    path: 'invite',
    loadChildren: () =>
      import('@expense-tracker-ui/user').then((m) => m.userRoutes),
    canActivate: [AppGuard],
    data: {
      roles: ['users'],
    },
  },
];
