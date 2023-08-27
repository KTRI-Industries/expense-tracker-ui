import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: emptyProps(),
    'Login Success': emptyProps(),
    'Login Failure': props<{ error: Error }>(),
    'Retrieve User Profile Success': props<{ userProfile: KeycloakProfile }>(),
    'Retrieve User Profile Failure': props<{ error: Error }>(),
  },
});
