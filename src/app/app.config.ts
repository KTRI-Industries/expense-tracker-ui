import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  AuthEffects,
  AuthFeature,
} from '@expense-tracker-ui/shared/auth/data-access';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  KeycloakPlaygroundEffects,
  PlayGroundFeature,
} from '@expense-tracker-ui/keycloak-playground';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideEffects(AuthEffects, KeycloakPlaygroundEffects),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideState(AuthFeature.authFeature),
    provideState(PlayGroundFeature.playgroundFeature),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
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
      enableBearerInterceptor: true,
    });
}
