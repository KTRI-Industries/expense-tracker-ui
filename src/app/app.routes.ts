import { Route } from '@angular/router';
import { AppGuardGuard } from './app-guard.guard';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@expense-tracker-ui/keycloak-playground').then(
        (m) => m.keycloakPlaygroundRoutes
      ),
    canActivate: [AppGuardGuard],
    data: {
      roles: ['administrator'],
    },
  },
];
