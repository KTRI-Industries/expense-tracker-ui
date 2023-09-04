import { Route } from '@angular/router';
import { KeycloakPlaygroundComponent } from './keycloak-playground/keycloak-playground.component';
import { provideEffects } from '@ngrx/effects';
import { KeycloakPlaygroundEffects } from './+state/keycloak-playground.effects';
import { provideState } from '@ngrx/store';
import { playgroundFeature } from './+state/keycloak-playground.reducer';

export const keycloakPlaygroundRoutes: Route[] = [
  {
    path: '',
    component: KeycloakPlaygroundComponent,
    providers: [
      provideState(playgroundFeature),
      provideEffects(KeycloakPlaygroundEffects),
    ],
  },
];
