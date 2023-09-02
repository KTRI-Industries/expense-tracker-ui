import { Route } from '@angular/router';
import { KeycloakPlaygroundComponent } from './keycloak-playground/keycloak-playground.component';

export const keycloakPlaygroundRoutes: Route[] = [
  { path: '', component: KeycloakPlaygroundComponent },
];
