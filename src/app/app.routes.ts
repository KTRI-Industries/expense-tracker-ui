import { Route } from '@angular/router';
import { AppGuardGuard } from './app-guard.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@expense-tracker-ui/homepage').then((m) => m.homepageRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('@expense-tracker-ui/keycloak-playground').then(
        (m) => m.keycloakPlaygroundRoutes,
      ),
    canActivate: [AppGuardGuard],
    data: {
      roles: ['administrator'],
    },
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('@expense-tracker-ui/transactions').then(
        (m) => m.transactionsRoutes,
      ),
    canActivate: [AppGuardGuard],
    data: {
      roles: ['users'],
    },
  },
];
