import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  createFeature,
  createReducer,
  FeatureConfig,
  on,
} from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';
import { KeycloakProfile } from 'keycloak-js';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState extends EntityState<AuthEntity> {
  selectedId: string | number | null; // which Auth record has been selected
  loaded: boolean; // has the Auth list been loaded
  error: string | null; // last known error (if any)
  userProfile: KeycloakProfile | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const authAdapter: EntityAdapter<AuthEntity> =
  createEntityAdapter<AuthEntity>();

export const initialAuthState: AuthState = authAdapter.getInitialState({
  // set initial required properties
  selectedId: null,
  loaded: false,
  error: null,
  userProfile: null,
});

const reducer: ActionReducer<AuthState> = createReducer(
  initialAuthState,
  on(AuthActions.initAuth, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(AuthActions.loadAuthSuccess, (state, { auth }) =>
    authAdapter.setAll(auth, { ...state, loaded: true })
  ),
  on(AuthActions.loadAuthFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.loginSuccess, (state, { userProfile }) => ({
    ...state,
    userProfile,
  }))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}

const featureConfig: FeatureConfig<string, AuthState> = {
  name: 'auth',
  reducer: reducer,
};
export const authFeature = createFeature(featureConfig);
