import { Route } from '@angular/router';
import { AppGuard } from "@expense-tracker-ui/shared/auth";

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
    canActivate: [AppGuard],
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
    canActivate: [AppGuard],
    data: {
      roles: ['users'],
    },
  },
];
