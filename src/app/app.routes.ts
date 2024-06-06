import { Route } from '@angular/router';
import { AppGuard } from '@expense-tracker-ui/shared/auth';
import { userRoutes } from '@expense-tracker-ui/user';

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
  /*  {
    path: 'invite',
    loadChildren: () =>
      import('@expense-tracker-ui/user').then((m) => m.userRoutes),
    canActivate: [AppGuard],
    data: {
      roles: ['users'],
    },
  },*/
  {
    path: 'user-page',
    loadChildren: () =>
      import('@expense-tracker-ui/user').then((m) => m.userRoutes),
    canActivate: [AppGuard],
    data: {
      roles: ['users'],
    },
  },
];
