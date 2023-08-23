import { createAction, props } from '@ngrx/store';
import { AuthEntity } from './auth.models';
import { KeycloakProfile } from 'keycloak-js';

export const initAuth = createAction('[Auth Page] Init');

export const loadAuthSuccess = createAction(
  '[Auth/API] Load Auth Success',
  props<{ auth: AuthEntity[] }>()
);

export const loadAuthFailure = createAction(
  '[Auth/API] Load Auth Failure',
  props<{ error: any }>()
);

export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ userProfile: KeycloakProfile }>()
);
