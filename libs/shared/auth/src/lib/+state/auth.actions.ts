import { createAction, createActionGroup, props } from "@ngrx/store";
import { AuthEntity } from './auth.models';
import { KeycloakProfile } from 'keycloak-js';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Success': props<{userProfile: KeycloakProfile}>(),
  }
})
