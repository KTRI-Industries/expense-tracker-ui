import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { AuthEntity } from './auth.models';
import { KeycloakProfile } from 'keycloak-js';
import { AuthActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState extends EntityState<AuthEntity> {
  // selectedId: string | number | null; // which Auth record has been selected
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
  // selectedId: null,
  loaded: false,
  error: null,
  userProfile: null,
});

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.retrieveUserProfileSuccess, (state, { userProfile }) => ({
      ...state,
      userProfile,
    }))
  ),
  extraSelectors: ({ selectUserProfile }) => ({
    selectIsLoggedIn: createSelector(
      selectUserProfile,
      (userProfile) => userProfile != null
    ),
  }),
});
