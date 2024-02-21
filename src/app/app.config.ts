import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  AuthEffects,
  AuthFeature,
  ExternalConfiguration,
} from '@expense-tracker-ui/shared/auth';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApiModule,
  Configuration,
  ConfigurationParameters,
} from '@expense-tracker-ui/api';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { ChipsComponent } from '@expense-tracker-ui/formly';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    // set configuration parameters here.
  };
  return new Configuration(params);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideEffects(AuthEffects),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideState(AuthFeature.authFeature),
    provideRouter(appRoutes), //  TODO why is this needed? keycloak redirect goes on loop when enabled withEnabledBlockingInitialNavigation()
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor, // TODO investigate why this interceptor has to be provided here, according to docs this should be provided by default
      multi: true,
    },
    {
      provide: Configuration,
      useFactory: (externalConfig: ExternalConfiguration) =>
        new Configuration({
          basePath: externalConfig.basePath,
        }),
      deps: [KeycloakService],
      multi: false,
    },
    importProvidersFrom(
      ApiModule.forRoot(apiConfigFactory),
      NgHttpLoaderModule.forRoot(),
      FormlyModule.forRoot({
        types: [
          {
            name: 'chips',
            component: ChipsComponent,
            defaultOptions: {
              defaultValue: [],
            },
          },
        ],
      }),
      FormlyMaterialModule,
      FormlyMatDatepickerModule,
    ), // TODO I have no idea what I m doing anymore
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
