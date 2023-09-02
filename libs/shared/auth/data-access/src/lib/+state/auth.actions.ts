import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: emptyProps(),
    Logout: emptyProps(),
    'Login Success': emptyProps(),
    'Login Failure': props<{ error: Error }>(),
    'Retrieve User Profile Success': props<{ userProfile: KeycloakProfile }>(),
    'Retrieve User Profile Failure': props<{ error: Error }>(),
    'Admin Call Success': props<{ message: string }>(),
    'Admin Call Error': props<{ error: Error }>(),
  },
});
