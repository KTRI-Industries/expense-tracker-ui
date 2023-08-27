import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { KeycloakService } from 'keycloak-angular';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  AuthEffects,
  AuthFeature,
} from '@expense-tracker-ui/shared/auth/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(AuthEffects),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideState(AuthFeature.authFeature),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    provideStoreDevtools({ logOnly: !isDevMode() }), // CAUTION: store dev tools must be configured AFTER the actual store
  ],
};

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://keycloak.127.0.0.1.nip.io',
        realm: 'expense-tracker-realm',
        clientId: 'expense-tracker-ui',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
