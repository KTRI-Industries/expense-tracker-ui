import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore, Store } from '@ngrx/store';
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
import {
  AmountInputComponent,
  ChipsComponent,
} from '@expense-tracker-ui/formly';

import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import '@angular/common/locales/global/el'; // LOCALE_ID is not enough
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import {
  ErrorHandlingFeature,
  GlobalErrorInterceptor,
} from '@expense-tracker-ui/shared/error-handling';

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
    provideState(ErrorHandlingFeature.errorHandlingFeature),
    provideRouter(appRoutes), //  TODO why is this needed? keycloak redirect goes on loop when enabled withEnabledBlockingInitialNavigation()
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, ExternalConfiguration],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor, // TODO investigate why this interceptor has to be provided here, according to docs this should be provided by default
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalErrorInterceptor,
      multi: true,
      deps: [MatSnackBar, KeycloakService, Store],
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
            wrappers: ['form-field'], // wraps custom field with material form field to show validation errors
          },
          {
            name: 'amount-input',
            component: AmountInputComponent,
            wrappers: ['form-field'], // wraps custom field with material form field to show validation errors
          },
        ],
        validationMessages: [
          { name: 'required', message: 'This field is required' },
        ],
      }),
      FormlyMaterialModule,
      FormlyMatDatepickerModule,
    ), // TODO I have no idea what I m doing anymore
    provideEnvironmentNgxMask({
      decimalMarker: ',',
      thousandSeparator: '.',
    }),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top' },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'el-GR' },
    { provide: LOCALE_ID, useValue: 'el-GR' },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'shortDate' },
    },
    provideMomentDateAdapter(
      {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
      { useUtc: true },
    ),
    provideStoreDevtools({ logOnly: !isDevMode() }), // CAUTION: store dev tools must be configured AFTER the actual store
  ],
};

function initializeKeycloak(
  keycloak: KeycloakService,
  externalConfig: ExternalConfiguration,
) {
  return () => {
    return keycloak.init({
      config: {
        url: externalConfig.keycloakUrl,
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
  };
}
